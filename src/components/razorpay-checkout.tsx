"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, CreditCard } from "lucide-react";

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

type PaymentState = "idle" | "creating-order" | "paying" | "verifying" | "success" | "error";

// ─── Razorpay Script Loader ─────────────────────────────────────────────────

let scriptLoadPromise: Promise<boolean> | null = null;

/**
 * Inject Razorpay script dynamically as a fallback.
 */
function injectRazorpayScript(resolve: (value: boolean) => void) {
  console.log("[RazorpayCheckout] Preloaded script not found, injecting dynamically...");
  // Check one more time before injecting
  if ((window as Record<string, unknown>).Razorpay) {
    resolve(true);
    return;
  }
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.onload = () => {
    console.log("[RazorpayCheckout] Dynamic script loaded successfully");
    scriptLoadPromise = null;
    resolve(true);
  };
  script.onerror = () => {
    console.error("[RazorpayCheckout] Dynamic script failed to load");
    scriptLoadPromise = null;
    resolve(false);
  };
  document.body.appendChild(script);
}

function loadRazorpayScript(): Promise<boolean> {
  // If already loaded, return immediately
  if (typeof window !== "undefined" && (window as Record<string, unknown>).Razorpay) {
    return Promise.resolve(true);
  }

  // If already loading, return existing promise
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve) => {
    // First, wait for the preloaded script from layout.tsx <Script> tag
    // Poll for up to ~3 seconds (10 attempts × 300ms)
    let attempts = 0;
    const maxAttempts = 10;
    const checkInterval = setInterval(() => {
      attempts++;
      if ((window as Record<string, unknown>).Razorpay) {
        clearInterval(checkInterval);
        console.log("[RazorpayCheckout] Preloaded script detected after", attempts, "attempts");
        resolve(true);
        return;
      }
      if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        // Fallback: inject script dynamically
        injectRazorpayScript(resolve);
      }
    }, 300);
  });

  return scriptLoadPromise;
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
  const [state, setState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAlreadyOnPlan = currentPlan === plan;
  const isHigherPlan =
    currentPlan === "premium" && plan === "pro";

  const getButtonLabel = useCallback((): string => {
    if (isAlreadyOnPlan) return "Current Plan";
    if (isHigherPlan) return "Downgrade";
    if (label) return label;

    switch (state) {
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
  }, [isAlreadyOnPlan, isHigherPlan, label, state]);

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

  const handlePayment = useCallback(async () => {
    setState("creating-order");
    setErrorMessage(null);

    try {
      // ── Step 1: Load Razorpay script ────────────────────────────────────
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay. Please check your internet connection.");
      }

      // ── Step 2: Create Razorpay order via API ──────────────────────────
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

      // ── Step 3: Open Razorpay checkout ──────────────────────────────────
      setState("paying");

      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
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
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || "Payment verification failed");
            }

            setState("success");
            onSuccess?.();
          } catch (err) {
            console.error("[RazorpayCheckout] Verification error:", err);
            setState("error");
            setErrorMessage(
              err instanceof Error ? err.message : "Payment verification failed"
            );
          }
        },
        prefill: {
          // These could be populated from user session
        },
        notes: {
          plan,
          period,
        },
        theme: {
          color: "#f59e0b", // Amber-500 to match NotiFetch branding
        },
        modal: {
          ondismiss: () => {
            if (state === "paying") {
              setState("idle");
              setErrorMessage("Payment was cancelled.");
            }
          },
        },
      };

      const RazorpayConstructor = (window as Record<string, unknown>).Razorpay as new (
        options: RazorpayOptions
      ) => RazorpayInstance;

      const rzp = new RazorpayConstructor(options);
      rzp.open();
    } catch (err) {
      console.error("[RazorpayCheckout] Error:", err);
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }, [plan, period, state, onSuccess]);

  const isDisabled =
    isAlreadyOnPlan ||
    state === "creating-order" ||
    state === "paying" ||
    state === "verifying";

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

      {errorMessage && (
        <p className="text-xs text-red-500 text-center max-w-xs">{errorMessage}</p>
      )}

      {state === "success" && (
        <p className="text-xs text-emerald-500 text-center">
          Plan upgraded successfully!
        </p>
      )}
    </div>
  );
}
