"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, CreditCard, WifiOff } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface RazorpayCheckoutProps {
  /** Plan to upgrade to: "starter" | "pro" | "premium" */
  plan: "starter" | "pro" | "premium";
  /** Billing period: "monthly" | "yearly" */
  period: "monthly" | "yearly";
  /** Current plan of the user */
  currentPlan?: string;
  /** Selected platform IDs to enable after payment */
  selectedPlatforms?: string[];
  /** Called when payment succeeds */
  onSuccess?: () => void;
  /** Optional label override for the button */
  label?: string;
  /** Optional CSS class for the button */
  className?: string;
  /** Optional variant for the button */
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

type PaymentState = "idle" | "creating-order" | "paying" | "verifying" | "success" | "error";

type ScriptStatus = "idle" | "loading" | "ready" | "error";

// ─── Constants ──────────────────────────────────────────────────────────────

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1500, 3000, 5000]; // Backoff delays in ms

// ─── Global script status (shared across component instances) ───────────────

let globalScriptStatus: ScriptStatus = "idle";
let globalStatusListeners: ((status: ScriptStatus) => void) = [];

function setGlobalScriptStatus(status: ScriptStatus) {
  globalScriptStatus = status;
  globalStatusListeners.forEach((listener) => listener(status));
}

function subscribeToScriptStatus(listener: (status: ScriptStatus) => void): () => void {
  globalStatusListeners.push(listener);
  listener(globalScriptStatus); // Immediately call with current status
  return () => {
    globalStatusListeners = globalStatusListeners.filter((l) => l !== listener);
  };
}

export function getRazorpayScriptStatus(): ScriptStatus {
  return globalScriptStatus;
}

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

// ─── Script Loading Logic ──────────────────────────────────────────────────

function isRazorpayOnWindow(): boolean {
  return typeof window !== "undefined" && !!(window as Record<string, unknown>).Razorpay;
}

/**
 * Find an existing <script> tag for the Razorpay checkout URL.
 */
function findExistingScript(): HTMLScriptElement | null {
  return document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
}

/**
 * Inject a new <script> tag for Razorpay checkout.
 * Returns a promise that resolves true if window.Razorpay becomes available,
 * or false if the script fails to load.
 */
function injectScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Don't create a duplicate script tag
    const existing = findExistingScript();
    if (existing) {
      // A script tag already exists — either from Next/Script or a previous attempt.
      // Check if Razorpay is already on window.
      if (isRazorpayOnWindow()) {
        resolve(true);
        return;
      }
      // If the existing script hasn't loaded yet, wait for it.
      // Attach event listeners to the existing script.
      const onReady = () => {
        setTimeout(() => resolve(isRazorpayOnWindow()), 500);
        cleanup();
      };
      const onError = () => {
        console.warn("[Razorpay] Existing script tag failed");
        resolve(false);
        cleanup();
      };
      const cleanup = () => {
        existing.removeEventListener("load", onReady);
        existing.removeEventListener("error", onError);
      };
      existing.addEventListener("load", onReady);
      existing.addEventListener("error", onError);

      // Safety timeout — if nothing fires in 15s, fail
      setTimeout(() => {
        cleanup();
        resolve(isRazorpayOnWindow());
      }, 15000);
      return;
    }

    // No existing script — create a fresh one
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    // NOTE: Do NOT add crossOrigin="anonymous" — Razorpay's CDN does not
    // serve CORS headers. Adding it causes the browser to block script
    // execution even though the file downloads successfully.

    script.onload = () => {
      // Give the SDK a moment to initialize on window
      setTimeout(() => {
        const available = isRazorpayOnWindow();
        if (!available) {
          console.warn("[Razorpay] Script loaded but window.Razorpay not available");
        }
        resolve(available);
      }, 500);
    };

    script.onerror = () => {
      console.error("[Razorpay] Script failed to load");
      // Remove the failed script so retry can create a new one
      script.remove();
      resolve(false);
    };

    document.head.appendChild(script);
  });
}

/**
 * Load Razorpay script with automatic retry logic.
 * - First tries to use any existing script tag (from Next/Script preload).
 * - If none exists, injects a new one.
 * - Retries up to MAX_RETRIES times with increasing delays.
 */
async function loadRazorpayWithRetry(): Promise<boolean> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const loaded = await injectScript();
    if (loaded) {
      return true;
    }

    console.log(
      `[Razorpay] Attempt ${attempt + 1}/${MAX_RETRIES} failed.` +
        (attempt < MAX_RETRIES - 1 ? ` Retrying in ${RETRY_DELAYS[attempt]}ms...` : " Giving up.")
    );

    // If not the last attempt, wait before retrying
    if (attempt < MAX_RETRIES - 1) {
      await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
      // Clean up any failed script element before retry
      const failed = findExistingScript();
      if (failed && !isRazorpayOnWindow()) {
        failed.remove();
      }
    }
  }

  return false;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function RazorpayCheckout({
  plan,
  period,
  currentPlan,
  selectedPlatforms,
  onSuccess,
  label,
  className,
  variant = "default",
}: RazorpayCheckoutProps) {
  const [state, setState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scriptStatus, setScriptStatus] = useState<ScriptStatus>(globalScriptStatus);

  // Subscribe to global script status changes
  useEffect(() => {
    const unsubscribe = subscribeToScriptStatus(setScriptStatus);
    return unsubscribe;
  }, []);

  // ── Next.js Script preload ──────────────────────────────────────────────
  // This loads the Razorpay script in the background as soon as the page is idle.
  // When it loads, we update the global status so the component knows it's ready.
  const handleScriptLoad = useCallback(() => {
    // Check for window.Razorpay after a short delay (SDK initialization)
    const checkInterval = setInterval(() => {
      if (isRazorpayOnWindow()) {
        setGlobalScriptStatus("ready");
        clearInterval(checkInterval);
        console.log("[Razorpay] Script preloaded and ready via Next/Script");
      }
    }, 100);
    // Stop checking after 3 seconds
    setTimeout(() => clearInterval(checkInterval), 3000);
  }, []);

  const handleScriptError = useCallback(() => {
    console.warn("[Razorpay] Next/Script preload failed — will retry on button click");
  }, []);

  // ── Computed values ─────────────────────────────────────────────────────

  const isAlreadyOnPlan = currentPlan === plan;
  const isHigherPlan =
    currentPlan === "premium" || (currentPlan === "pro" && plan === "starter");

  const getButtonLabel = useCallback((): string => {
    if (isAlreadyOnPlan) return "Current Plan";
    if (isHigherPlan) return "Downgrade";
    if (label) return label;

    switch (state) {
      case "creating-order":
        return "Creating order...";
      case "paying":
        if (scriptStatus === "loading") return "Loading payment gateway...";
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
  }, [isAlreadyOnPlan, isHigherPlan, label, state, scriptStatus]);

  const getButtonIcon = useCallback(() => {
    switch (state) {
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
  }, [state]);

  // ── Payment handler ─────────────────────────────────────────────────────

  const handlePayment = useCallback(async () => {
    setState("creating-order");
    setErrorMessage(null);

    try {
      // ── Step 1: Ensure Razorpay script is loaded ──────────────────────
      if (!isRazorpayOnWindow()) {
        setGlobalScriptStatus("loading");
        setState("paying"); // Show "Loading payment gateway..."

        const scriptLoaded = await loadRazorpayWithRetry();
        if (!scriptLoaded) {
          setGlobalScriptStatus("error");
          throw new Error(
            "Could not load Razorpay payment gateway after multiple attempts. " +
            "This is usually caused by:\n" +
            "• An ad blocker or browser extension blocking the script\n" +
            "• A slow or unstable internet connection\n" +
            "• A strict Content Security Policy (CSP)\n\n" +
            "Please try: disabling ad blockers, refreshing the page, or using a different browser."
          );
        }
        setGlobalScriptStatus("ready");
      }

      const RazorpayConstructor = (window as Record<string, unknown>).Razorpay as new (
        options: RazorpayOptions
      ) => RazorpayInstance;

      if (!RazorpayConstructor) {
        throw new Error("Razorpay SDK not available. Please refresh the page and try again.");
      }

      // ── Step 2: Create Razorpay order via API ──────────────────────────
      setState("creating-order");

      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, period, selectedPlatforms }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        const errorMsg = errorData.error || `Failed to create order (${orderResponse.status})`;

        if (orderResponse.status === 503 || errorMsg.toLowerCase().includes("not configured")) {
          throw new Error("Payment system is not configured yet. Please contact support.");
        }

        throw new Error(errorMsg);
      }

      const orderData = await orderResponse.json();

      if (!orderData.orderId || !orderData.key) {
        throw new Error("Invalid order response from server. Please try again.");
      }

      // ── Step 3: Open Razorpay checkout ──────────────────────────────────
      setState("paying");

      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "NotiFetch",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${period === "yearly" ? "Yearly" : "Monthly"}`,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          // ── Step 4: Verify payment ────────────────────────────────────
          setState("verifying");

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
                selectedPlatforms,
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json().catch(() => ({}));
              throw new Error(errorData.error || "Payment verification failed");
            }

            setState("success");
            onSuccess?.();
          } catch (err) {
            console.error("[RazorpayCheckout] Verification error:", err);
            setState("error");
            setErrorMessage(err instanceof Error ? err.message : "Payment verification failed");
          }
        },
        prefill: {},
        notes: { plan, period },
        theme: { color: "#f59e0b" },
        modal: {
          ondismiss: () => {
            setState("idle");
            setErrorMessage("Payment was cancelled.");
          },
        },
      };

      const rzp = new RazorpayConstructor(options);
      rzp.open();
    } catch (err) {
      console.error("[RazorpayCheckout] Error:", err);
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }, [plan, period, selectedPlatforms, onSuccess]);

  const isDisabled =
    isAlreadyOnPlan || state === "creating-order" || state === "paying" || state === "verifying";

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Preload Razorpay script in the background using Next.js Script */}
      <Script
        src={RAZORPAY_SCRIPT_URL}
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />

      {/* Show warning if script failed to load previously */}
      {scriptStatus === "error" && state === "idle" && (
        <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1">
          <WifiOff className="w-3 h-3" />
          <span>Payment gateway may be blocked. Click to retry.</span>
        </div>
      )}

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

      {errorMessage && (
        <div className="text-xs text-red-500 text-center max-w-xs whitespace-pre-line">
          <p>{errorMessage}</p>
        </div>
      )}

      {state === "success" && (
        <p className="text-xs text-emerald-500 text-center">Plan upgraded successfully!</p>
      )}
    </div>
  );
}
