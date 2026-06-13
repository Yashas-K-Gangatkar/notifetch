"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, CreditCard, AlertCircle } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface RazorpayCheckoutProps {
  /** Plan to upgrade to: "pro" | "premium" */
  plan: "pro" | "premium";
  /** Billing period: "monthly" | "yearly" */
  period: "monthly" | "yearly";
  /** Current plan of the user */
  currentPlan?: string;
  /** Called when payment succeeds */
  onSuccess?: () => void;
  /** Optional label override for the button */
  label?: string;
  /** Optional CSS class for the button */
  className?: string;
  /** Optional variant for the button */
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

type ScriptState = "loading" | "ready" | "failed";
type PaymentState = "idle" | "creating-order" | "paying" | "verifying" | "success" | "error";

// ─── Razorpay Window Interface ──────────────────────────────────────────────

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

// ─── Script Loader (module-level singleton) ─────────────────────────────────
// This is the ONLY place Razorpay script is loaded. No <Script> tag in layout.

type ScriptLoadResult = "ready" | "failed";
let globalScriptPromise: Promise<ScriptLoadResult> | null = null;
let globalScriptState: ScriptState = "loading";

function getRazorpayGlobal(): unknown {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as Record<string, unknown>).Razorpay;
}

function injectScriptTag(): Promise<ScriptLoadResult> {
  return new Promise<ScriptLoadResult>((resolve) => {
    console.log("[RZP] Injecting checkout.js script tag into <head>...");

    // Don't inject duplicate
    const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existing) {
      console.log("[RZP] Script tag already exists in DOM, checking for global...");
      // Give it more time if global isn't ready yet
      let waitCount = 0;
      const waitInterval = setInterval(() => {
        waitCount++;
        if (getRazorpayGlobal()) {
          clearInterval(waitInterval);
          console.log("[RZP] Global found after waiting for existing script. Ready!");
          globalScriptState = "ready";
          resolve("ready");
        } else if (waitCount >= 30) {
          // Waited 6 seconds for existing script — remove it and inject fresh
          clearInterval(waitInterval);
          console.log("[RZP] Existing script didn't set global after 6s. Removing and re-injecting...");
          existing.remove();
          injectFreshScript(resolve);
        }
      }, 200);
      return;
    }

    injectFreshScript(resolve);
  });
}

function injectFreshScript(resolve: (result: ScriptLoadResult) => void) {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = false; // Load synchronously-ish to ensure execution order
  // DO NOT set crossOrigin — it can cause CORS issues with Razorpay CDN

  script.onload = () => {
    console.log("[RZP] Script onload fired. Checking for window.Razorpay...");
    // The script may set the global immediately or after a microtask
    // Poll for up to 3 seconds after load
    let checkCount = 0;
    const checkInterval = setInterval(() => {
      checkCount++;
      if (getRazorpayGlobal()) {
        clearInterval(checkInterval);
        console.log("[RZP] window.Razorpay found! Script ready.");
        globalScriptState = "ready";
        resolve("ready");
      } else if (checkCount >= 15) {
        clearInterval(checkInterval);
        console.error("[RZP] Script loaded but window.Razorpay NOT found after 3s. Possible CSP or script error.");
        globalScriptState = "failed";
        resolve("failed");
      }
    }, 200);
  };

  script.onerror = (e) => {
    console.error("[RZP] Script onerror fired:", e);
    console.error("[RZP] This usually means: 1) Ad blocker, 2) CSP blocking, 3) Network issue, 4) DNS failure");
    globalScriptState = "failed";
    resolve("failed");
  };

  document.head.appendChild(script);
  console.log("[RZP] Script tag appended to <head>");
}

function loadRazorpayScript(): Promise<ScriptLoadResult> {
  // Already loaded?
  if (getRazorpayGlobal()) {
    console.log("[RZP] window.Razorpay already available");
    globalScriptState = "ready";
    return Promise.resolve("ready");
  }

  // Already loading?
  if (globalScriptPromise) {
    console.log("[RZP] Script load already in progress, joining existing promise");
    return globalScriptPromise;
  }

  globalScriptState = "loading";
  globalScriptPromise = injectScriptTag().then((result) => {
    globalScriptPromise = null; // Allow retries if failed
    return result;
  });

  return globalScriptPromise;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function RazorpayCheckout({
  plan,
  period,
  currentPlan,
  onSuccess,
  label,
  className,
  variant = "default",
}: RazorpayCheckoutProps) {
  const [scriptState, setScriptState] = useState<ScriptState>(globalScriptState);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diagnosticInfo, setDiagnosticInfo] = useState<string | null>(null);
  const retryCountRef = useRef(0);

  const isAlreadyOnPlan = currentPlan === plan;
  const isHigherPlan = currentPlan === "premium" && plan === "pro";

  // ── Load Razorpay script on mount ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    console.log("[RZP] Component mounted, starting script load...");
    console.log("[RZP] Current URL:", window.location.href);
    console.log("[RZP] User Agent:", navigator.userAgent.substring(0, 100));

    loadRazorpayScript().then((state) => {
      if (!cancelled) {
        console.log("[RZP] Script load completed with state:", state);
        setScriptState(state);
        if (state === "failed") {
          setDiagnosticInfo(
            "Script loaded but Razorpay global not found. Check browser console for details."
          );
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Retry loading script ─────────────────────────────────────────────────
  const retryScriptLoad = useCallback(() => {
    retryCountRef.current += 1;
    console.log(`[RZP] Retry #${retryCountRef.current}`);
    setScriptState("loading");
    setDiagnosticInfo(null);
    setErrorMessage(null);
    globalScriptState = "loading";
    globalScriptPromise = null;

    loadRazorpayScript().then((state) => {
      console.log("[RZP] Retry result:", state);
      setScriptState(state);
      if (state === "failed") {
        setDiagnosticInfo(
          "Retry failed too. Check: 1) Ad blockers disabled? 2) Network working? 3) Try hard refresh (Ctrl+Shift+R)"
        );
      }
    });
  }, []);

  const getButtonLabel = useCallback((): string => {
    if (isAlreadyOnPlan) return "Current Plan";
    if (isHigherPlan) return "Downgrade";

    if (scriptState === "loading") return "Loading payment gateway...";
    if (scriptState === "failed") return "Retry — click to reload";

    if (label) return label;

    switch (paymentState) {
      case "creating-order":
        return "Creating order...";
      case "paying":
        return "Processing payment...";
      case "verifying":
        return "Verifying payment...";
      case "success":
        return "Payment successful!";
      case "error":
        return "Try again";
      default:
        return "Upgrade";
    }
  }, [isAlreadyOnPlan, isHigherPlan, label, scriptState, paymentState]);

  const getButtonIcon = useCallback(() => {
    if (scriptState === "loading") return <Loader2 className="w-4 h-4 animate-spin" />;
    if (scriptState === "failed") return <AlertCircle className="w-4 h-4" />;

    switch (paymentState) {
      case "creating-order":
      case "paying":
      case "verifying":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4" />;
      case "error":
        return <XCircle className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  }, [scriptState, paymentState]);

  const handlePayment = useCallback(async () => {
    // If script failed, retry loading
    if (scriptState === "failed") {
      retryScriptLoad();
      return;
    }

    // Wait for script if still loading
    if (scriptState === "loading") {
      setDiagnosticInfo("Payment gateway is still loading, please wait...");
      return;
    }

    // Double-check Razorpay is available
    if (!getRazorpayGlobal()) {
      console.error("[RZP] window.Razorpay not available despite scriptState=ready!");
      setScriptState("failed");
      setErrorMessage("Payment gateway lost. Click to retry.");
      return;
    }

    setPaymentState("creating-order");
    setErrorMessage(null);
    setDiagnosticInfo(null);

    try {
      // ── Step 1: Create Razorpay order via API ──────────────────────────
      console.log("[RZP] Creating order for plan:", plan, "period:", period);
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, period }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderData = await orderResponse.json();
      console.log("[RZP] Order created:", orderData.orderId);

      // ── Step 2: Open Razorpay checkout ──────────────────────────────────
      setPaymentState("paying");

      const RazorpayConstructor = (window as unknown as Record<string, unknown>).Razorpay as new (
        options: RazorpayOptions
      ) => RazorpayInstance;

      const rzp = new RazorpayConstructor({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "NotiFetch",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${period === "yearly" ? "Yearly" : "Monthly"}`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          // ── Step 3: Verify payment ────────────────────────────────────
          setPaymentState("verifying");

          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                period,
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || "Payment verification failed");
            }

            console.log("[RZP] Payment verified successfully!");
            setPaymentState("success");
            onSuccess?.();
          } catch (err) {
            console.error("[RZP] Verification error:", err);
            setPaymentState("error");
            setErrorMessage(
              err instanceof Error ? err.message : "Payment verification failed"
            );
          }
        },
        prefill: {},
        notes: { plan, period },
        theme: { color: "#f59e0b" },
        modal: {
          ondismiss: () => {
            setPaymentState("idle");
            setErrorMessage("Payment was cancelled.");
          },
        },
      });

      console.log("[RZP] Opening Razorpay checkout modal...");
      rzp.open();
    } catch (err) {
      console.error("[RZP] Payment error:", err);
      setPaymentState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }, [plan, period, scriptState, onSuccess, retryScriptLoad]);

  const isDisabled =
    isAlreadyOnPlan ||
    (scriptState === "loading" && paymentState === "idle") ||
    paymentState === "creating-order" ||
    paymentState === "paying" ||
    paymentState === "verifying";

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handlePayment}
        disabled={isDisabled}
        variant={variant}
        className={className}
        size="sm"
      >
        {getButtonIcon()}
        <span className="ml-2">{getButtonLabel()}</span>
      </Button>

      {scriptState === "failed" && !errorMessage && (
        <div className="text-center max-w-xs">
          <p className="text-xs text-amber-500 mb-1">
            Payment gateway couldn&apos;t load. Click the button to retry.
          </p>
          <p className="text-xs text-muted-foreground">
            Tips: Disable ad blockers, ensure stable internet, try hard refresh (Ctrl+Shift+R)
          </p>
        </div>
      )}

      {diagnosticInfo && (
        <p className="text-xs text-blue-400 text-center max-w-xs">{diagnosticInfo}</p>
      )}

      {errorMessage && (
        <p className="text-xs text-red-500 text-center max-w-xs">{errorMessage}</p>
      )}

      {paymentState === "success" && (
        <p className="text-xs text-emerald-500 text-center">
          Plan upgraded successfully!
        </p>
      )}
    </div>
  );
}
