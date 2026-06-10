"use client";

import { useSession } from "next-auth/react";
import { TrendingUp, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EarningsSection({ acceptedOrders }: { acceptedOrders: any[] }) {
  const { data: session } = useSession();

  if (session) {
    return (
      <section id="earnings" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 mb-6">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Track Your Earnings</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            View your real earnings breakdown by platform, day, and category.
            See which platforms pay the most and optimize your time.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="px-8 h-12">
              View Earnings Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="earnings" className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 mb-6">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Earnings Analytics</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          See your real earnings across all delivery platforms in one dashboard.
          Multi-currency support — INR, USD, EUR, GBP, and 20+ more currencies.
        </p>
        <Link href="/auth/signin">
          <Button size="lg" variant="outline" className="px-8 h-12">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In to Track Earnings
          </Button>
        </Link>
      </div>
    </section>
  );
}
