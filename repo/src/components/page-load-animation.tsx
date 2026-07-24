"use client";

import { useEffect, useState } from "react";
import { NFLogo } from "@/components/nf-logo";

/**
 * v2.9.13: Page Load Animation
 *
 * Plays a 2.2-second logo reveal on first page load:
 *   0.0s — 0.6s: NotiFetch logo + name fade+scale in from center
 *   0.6s — 1.2s: DID slogan appears below
 *   1.2s — 1.8s: Background gradient sweeps across
 *   1.8s — 2.2s: Whole overlay slides up and fades out
 *
 * After animation completes, overlay is removed from DOM (display:none)
 * so it doesn't intercept clicks.
 *
 * Only plays on first visit per session (sessionStorage flag).
 */
export function PageLoadAnimation() {
  // v2.9.41: Hydration-safe pattern — always render null on the server AND
  // on the client's first render, then read sessionStorage in useEffect
  // (which only runs on the client, after hydration completes).
  //
  // Previous versions used lazy useState(() => sessionStorage.getItem(...))
  // which caused hydration mismatches: server renders <Overlay/> (visible=true)
  // but client renders null (visible=false because sessionStorage has the flag).
  // React 19 throws a hydration error when this happens.
  //
  // Trade-off: the animation may not appear on the very first paint for
  // users who already saw it this session — that's fine, because for those
  // users the animation SHOULD be hidden anyway. For first-time visitors,
  // sessionStorage is empty on both server and client, so the animation
  // shows correctly after a 1-frame delay (imperceptible).
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"logo" | "slogan" | "exit">("logo");

  useEffect(() => {
    // Client-only: check sessionStorage after mount
    if (sessionStorage.getItem("notifetch_intro_played")) {
      // Already saw it this session — don't show again
      return;
    }
    sessionStorage.setItem("notifetch_intro_played", "1");
    setVisible(true);

    const t1 = setTimeout(() => setPhase("slogan"), 600);
    const t2 = setTimeout(() => setPhase("exit"), 1400);
    const t3 = setTimeout(() => setVisible(false), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 transition-all duration-700 ${
        phase === "exit" ? "opacity-0 -translate-y-full" : "opacity-100"
      }`}
      style={{ pointerEvents: phase === "exit" ? "none" : "auto" }}
    >
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        {/* Logo + Name */}
        <div
          className={`flex items-center gap-4 transition-all duration-600 ${
            phase === "logo"
              ? "opacity-0 scale-75 translate-y-4"
              : "opacity-100 scale-100 translate-y-0"
          }`}
        >
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-2xl p-2">
            <NFLogo className="w-16 h-8" />
          </div>
          <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
            NotiFetch
          </span>
        </div>

        {/* DID Slogan */}
        <div
          className={`transition-all duration-600 ${
            phase === "slogan" || phase === "exit"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-base sm:text-lg font-bold tracking-[0.4em] uppercase text-white/90">
            Doing is Doing
          </p>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/60 mt-1">
            — DID —
          </p>
        </div>

        {/* Loading dots */}
        <div
          className={`flex gap-1.5 transition-opacity duration-300 ${
            phase === "exit" ? "opacity-0" : "opacity-100"
          }`}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-white/80 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
