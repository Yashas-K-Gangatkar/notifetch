"use client";

import { useState, useMemo, Suspense, useCallback, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Zap, Mail, Loader2, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import { BackButton } from "@/components/back-button";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid OTP code. Please try again.",
  OAuthAccountNotLinked: "This email is already associated with another sign-in method.",
  OAuthSignin: "There was a problem signing in with Google.",
  OAuthCallback: "There was a problem completing the Google sign-in.",
  Default: "An unexpected error occurred. Please try again.",
};

function getErrorMessage(error: string): string { return ERROR_MESSAGES[error] || ERROR_MESSAGES.Default; }

type Step = "email" | "otp";

function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorParam = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const error = useMemo(() => formError || (errorParam ? getErrorMessage(errorParam) : null), [formError, errorParam]);

  useEffect(() => { if (resendCooldown <= 0) return; const t = setTimeout(() => setResendCooldown(c => c - 1), 1000); return () => clearTimeout(t); }, [resendCooldown]);

  const validateEmail = (): boolean => {
    if (!email.trim()) { setEmailError("Email is required"); return false; }
    if (email.length > 320) { setEmailError("Email is too long"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Please enter a valid email"); return false; }
    setEmailError(null); return true;
  };

  const handleSendOTP = useCallback(async () => {
    if (!validateEmail()) return;
    setIsLoading(true); setFormError(null);
    try {
      const res = await fetch("/api/auth/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.toLowerCase().trim() }) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || "Failed to send OTP"); setIsLoading(false); return; }
      setStep("otp"); setResendCooldown(60); setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch { setFormError("Something went wrong."); } finally { setIsLoading(false); }
  }, [email]);

  const handleOTPChange = useCallback((index: number, value: string) => {
    if (value.length > 1) { const d = value.replace(/\D/g, "").slice(0, 6).split(""); const n = [...otp]; d.forEach((v, i) => { if (index + i < 6) n[index + i] = v; }); setOtp(n); otpRefs.current[Math.min(index + d.length, 5)]?.focus(); return; }
    const digit = value.replace(/\D/g, ""); const n = [...otp]; n[index] = digit; setOtp(n);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }, [otp]);

  const handleOTPKeyDown = useCallback((index: number, e: React.KeyboardEvent) => { if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus(); }, [otp]);

  const handleVerifyOTP = useCallback(async () => {
    const code = otp.join("");
    if (code.length !== 6) { setFormError("Please enter the complete 6-digit code"); return; }
    setIsLoading(true); setFormError(null);
    try {
      const result = await signIn("otp", { email: email.toLowerCase().trim(), code, callbackUrl, redirect: false });
      if (result?.error) { setFormError(getErrorMessage(result.error)); setOtp(["", "", "", "", "", ""]); otpRefs.current[0]?.focus(); }
      else if (result?.ok && result?.url) window.location.href = result.url;
    } catch { setFormError("Something went wrong."); } finally { setIsLoading(false); }
  }, [email, otp, callbackUrl]);

  const handleGoogleSignIn = async () => { setFormError(null); setIsGoogleLoading(true); try { await signIn("google", { callbackUrl }); } catch { setFormError("Failed to sign in with Google."); setIsGoogleLoading(false); } };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      {/* Animated ambient background — v2.9.13 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/8 via-transparent to-orange-500/8" />
        {/* Floating animated blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/12 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/12 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Back button */}
      <div className="absolute top-4 left-4 z-10 animate-[fadeInDown_0.5s_ease-out]">
        <BackButton fallback="/" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-[fadeUp_0.7s_ease-out]">
        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-2xl p-2 shadow-xl shadow-amber-500/15 transition-transform hover:scale-105">
            <img
              src="/qr-code.png"
              alt="Scan to install NotiFetch"
              className="w-28 h-28 rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-amber-500/25 mb-4 transition-transform hover:rotate-6 hover:scale-110">
            <Zap className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            NotiFetch
          </h1>
          <p className="text-sm text-muted-foreground mt-1">One Feed. All Notifications. Zero Credentials.</p>
          {/* DID slogan badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 animate-[fadeIn_1s_ease-out_0.5s_both]">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-600 dark:text-amber-400">
              Doing is Doing — DID
            </span>
          </div>
        </div>

        <Card className="border-border/50 shadow-2xl shadow-black/20 transition-all duration-300 hover:shadow-amber-500/10">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">{step === "email" ? "Welcome" : "Verify your email"}</CardTitle>
            <CardDescription>{step === "email" ? "Sign in to your NotiFetch account" : "We sent a code to " + email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-[shake_0.4s_ease-out]"><p>{error}</p></div>}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-amber-200/80"><span className="font-semibold text-amber-500">NotiFetch never asks for delivery platform credentials.</span> We only need your email. No passwords needed.</p>
            </div>
            <Button variant="outline" className="w-full h-11 border-border/70 hover:bg-muted/80 hover:border-amber-500/30 transition-all group" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
              {isGoogleLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>}
              Continue with Google
            </Button>
            <div className="relative"><Separator /><span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">or</span></div>
            {step === "email" && (
              <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(null); }} onKeyDown={e => { if (e.key === "Enter") handleSendOTP(); }} className="pl-9 h-10 transition-all focus:ring-2 focus:ring-amber-500/20" disabled={isLoading || isGoogleLoading} autoComplete="email" /></div>
                  {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
                </div>
                <Button onClick={handleSendOTP} className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending code...</> : <><KeyRound className="w-4 h-4 mr-2" />Send login code</>}
                </Button>
              </div>
            )}
            {step === "otp" && (
              <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                <div className="space-y-3">
                  <Label className="text-center block">Enter 6-digit code</Label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => <Input key={i} ref={el => { otpRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={6} value={digit} onChange={e => handleOTPChange(i, e.target.value)} onKeyDown={e => handleOTPKeyDown(i, e)} className="w-11 h-13 text-center text-lg font-bold p-0 border-border/70 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" disabled={isLoading} aria-label={"Digit " + (i + 1)} />)}
                  </div>
                </div>
                <Button onClick={handleVerifyOTP} className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5" disabled={isLoading || otp.join("").length !== 6}>
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : "Verify & Sign in"}
                </Button>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-muted-foreground">Didn&apos;t get the code?</span>
                  {resendCooldown > 0 ? <span className="text-muted-foreground">Resend in {resendCooldown}s</span> : <button onClick={handleSendOTP} className="text-amber-500 hover:text-amber-400 font-semibold" disabled={isLoading}>Resend code</button>}
                </div>
                <button onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); setFormError(null); }} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">Use a different email</button>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center pb-6"><p className="text-xs text-muted-foreground text-center">No password needed. Sign in with Google or get a one-time code.</p></CardFooter>
        </Card>
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground animate-[fadeIn_0.8s_ease-out_0.4s_both]">
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a><span className="text-border">•</span><a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* Inline keyframes for v2.9.13 animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

export default function SignInPage() {
  return <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center bg-background"><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-amber-500/25 animate-pulse"><Zap className="w-8 h-8 text-white" /></div></div>}><SignInForm /></Suspense>;
}
