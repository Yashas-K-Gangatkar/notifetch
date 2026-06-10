"use client";

import { useSession } from "next-auth/react";
import { Bell, LogIn, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DashboardSection({
  onAccept,
  onDecline,
  acceptedOrders,
}: {
  onAccept: (order: any) => void;
  onDecline: (orderId: string) => void;
  acceptedOrders: any[];
}) {
  const { data: session } = useSession();

  // If user is logged in, show a prompt to go to the real dashboard
  if (session) {
    return (
      <section id="dashboard" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Your Live Dashboard</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            View your real-time notifications, track earnings, and manage all your delivery platforms from one place.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 h-12">
              Open Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  // If not logged in, show a sign-in prompt
  return (
    <section id="dashboard" className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-6">
          <Bell className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Live Notification Feed</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Sign in to see your real-time delivery notifications from all platforms.
          No fake data — only your actual orders and earnings.
        </p>
        <Link href="/auth/signin">
          <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 h-12">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In to Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
}
