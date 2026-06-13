"use client";

import { useState, useCallback, useEffect } from "react";
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

// ─── Module-level script loader (shared across all instances) ────────────────

let scriptState: ScriptState = "loading";
let scriptPromise: Promise<ScriptState> | null = null;

function startLoadingRazorpayScript(): Promise<ScriptState> {
  if (typeof window === "undefined") return Promise.resolve("failed");

  // Already loaded?
  if ((window as Record<string, unknown>).Razorpay) {
    scriptState = "ready";
    return Promise.resolve("ready");
  }

  // Already loading?
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<ScriptState>((resolve) => {
    // Step 1: Check if a script tag for Razorpay already exists (from <Script> in layout)
    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript && (window as Record<string, unknown>).Razorpay) {
      scriptState = "ready";
      scriptPromise = null;
      resolve("ready");
      return;
    }

    // Step 2: Inject our own script tag directly — most reliable method
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      // Double-check that Razorpay global is actually available
      if ((window as Record<string, unknown>).Razorpay) {
        console.log("[RazorpayCheckout] Script loaded successfully");
        scriptState = "ready";
        scriptPromise = null;
        resolve("ready");
      } else {
        // Script loaded but global not available — might be a CSP issue
        console.error("[RazorpayCheckout] Script loaded but window.Razorpay is not defined");
        scriptState = "failed";
        scriptPromise = null;
        resolve("failed");
      }
    };

    script.onerror = () => {
      console.error("[RazorpayCheckout] Script tag failed to load — likely blocked by browser/ad blocker or CSP");
      scriptState = "failed";
      scriptPromise = null;
      resolve("failed");
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
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
  const [scriptState, setScriptState] = useState<ScriptState>("loading");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAlreadyOnPlan = currentPlan === plan;
  const isHigherPlan = currentPlan === "premium" && plan === "pro";

  // ── Load Razorpay script on mount ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    startLoadingRazorpayScript().then((state) => {
      if (!cancelled) {
        setScriptState(state);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Retry loading script ─────────────────────────────────────────────────
  const retryScriptLoad = useCallback(() => {
    setScriptState("loading");
    // Reset module-level state so it tries again
    scriptPromise = null;
    startLoadingRazorpayScript().then((state) => {
      setScriptState(state);
    });
  }, []);

  const getButtonLabel = useCallback((): string => {
    if (isAlreadyOnPlan) return "Current Plan";
    if (isHigherPlan) return "Downgrade";

    if (scriptState === "loading") return "Loading payment...";
    if (scriptState === "failed") return "Retry loading";

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
      return;
    }

    setPaymentState("creating-order");
    setErrorMessage(null);

    try {
      // ── Step 1: Create Razorpay order via API ──────────────────────────
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

      // ── Step 2: Open Razorpay checkout ──────────────────────────────────
      setPaymentState("paying");

      const RazorpayConstructor = (window as Record<string, unknown>).Razorpay as new (
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

            setPaymentState("success");
            onSuccess?.();
          } catch (err) {
            console.error("[RazorpayCheckout] Verification error:", err);
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

      rzp.open();
    } catch (err) {
      console.error("[RazorpayCheckout] Error:", err);
      setPaymentState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }, [plan, period, scriptState, paymentState, onSuccess, retryScriptLoad]);

  const isDisabled =
    isAlreadyOnPlan ||
    scriptState === "loading" ||
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
        <p className="text-xs text-amber-500 text-center max-w-xs">
          Payment gateway couldn&apos;t load. Click to retry, or try disabling ad blockers.
        </p>
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
