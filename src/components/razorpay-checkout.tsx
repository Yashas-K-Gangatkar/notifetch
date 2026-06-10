"use client";

import { useState, useCallback, useEffect } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, CreditCard, ExternalLink } from "lucide-react";

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

// ─── Razorpay Script Loader ─────────────────────────────────────────────────

let scriptLoadPromise: Promise<boolean> | null = null;

function loadRazorpayScript(): Promise<boolean> {
  if (scriptLoadPromise) return scriptLoadPromise;

  // Check if already loaded
  if (typeof window !== "undefined" && (window as Record<string, unknown>).Razorpay) {
    return Promise.resolve(true);
  }

  scriptLoadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      // Give it a tick to initialize
      setTimeout(() => {
        const available = !!(window as Record<string, unknown>).Razorpay;
        if (!available) {
          scriptLoadPromise = null;
        }
        resolve(available);
      }, 100);
    };
    script.onerror = () => {
      scriptLoadPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
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
  selectedPlatforms,
  onSuccess,
  label,
  className,
  variant = "default",
}: RazorpayCheckoutProps) {
  const [state, setState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  // Preload Razorpay script when component mounts
  useEffect(() => {
    loadRazorpayScript().then((loaded) => {
      setScriptReady(loaded);
    });
  }, []);

  const isAlreadyOnPlan = currentPlan === plan;
  const isHigherPlan =
    (currentPlan === "premium") ||
    (currentPlan === "pro" && plan === "starter");

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
      // ── Step 1: Ensure Razorpay script is loaded ──────────────────────
      const RazorpayConstructor = (window as Record<string, unknown>).Razorpay as new (
        options: RazorpayOptions
      ) => RazorpayInstance;

      if (!RazorpayConstructor) {
        // Try loading the script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error(
            "Razorpay SDK failed to load. This is usually caused by an ad blocker or privacy extension. " +
            "Please disable ad blockers for this site and try again, or open the payment page in an incognito window."
          );
        }
      }

      // ── Step 2: Create Razorpay order via API ──────────────────────────
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, period, selectedPlatforms }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        const errorMsg = errorData.error || `Failed to create order (${orderResponse.status})`;

        // Provide a more helpful message when Razorpay is not configured
        if (orderResponse.status === 503 || errorMsg.toLowerCase().includes("not configured")) {
          throw new Error(
            "Razorpay is not configured yet. Please add your Razorpay API keys (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) in the .env file and Vercel environment variables."
          );
        }

        throw new Error(errorMsg);
      }

      const orderData = await orderResponse.json();

      // ── Step 3: Open Razorpay checkout ──────────────────────────────────
      setState("paying");

      const RzpConstructor = (window as Record<string, unknown>).Razorpay as new (
        options: RazorpayOptions
      ) => RazorpayInstance;

      if (!RzpConstructor) {
        throw new Error("Razorpay SDK not available. Please refresh the page and try again.");
      }

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
            setErrorMessage(
              err instanceof Error ? err.message : "Payment verification failed"
            );
          }
        },
        prefill: {},
        notes: {
          plan,
          period,
        },
        theme: {
          color: "#f59e0b", // Amber-500 to match NotiFetch branding
        },
        modal: {
          ondismiss: () => {
            setState("idle");
            setErrorMessage("Payment was cancelled.");
          },
        },
      };

      const rzp = new RzpConstructor(options);
      rzp.open();
    } catch (err) {
      console.error("[RazorpayCheckout] Error:", err);
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }, [plan, period, selectedPlatforms, onSuccess]);

  const isDisabled =
    isAlreadyOnPlan ||
    state === "creating-order" ||
    state === "paying" ||
    state === "verifying";

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Preload Razorpay script via next/script for better caching */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
        onError={() => setScriptReady(false)}
      />

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
        <div className="text-xs text-red-500 text-center max-w-xs space-y-1">
          <p>{errorMessage}</p>
          {errorMessage.includes("ad blocker") && (
            <a
              href="https://checkout.razorpay.com/v1/checkout.js"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-500 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Test if Razorpay loads in your browser
            </a>
          )}
        </div>
      )}

      {state === "success" && (
        <p className="text-xs text-emerald-500 text-center">
          Plan upgraded successfully!
        </p>
      )}
    </div>
  );
}
