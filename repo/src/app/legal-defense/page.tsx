"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Scale, FileText, AlertTriangle, CheckCircle2, Gavel } from "lucide-react";
import { BackButton } from "@/components/back-button";

export default function LegalDefensePage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/" />
            <h1 className="text-lg font-bold">Legal & Compliance</h1>
          </div>
          <Badge variant="outline" className="text-amber-500 border-amber-500/30">
            <Shield className="w-3 h-3 mr-1" /> Bulletproof
          </Badge>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25">
            <Gavel className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Legal & Compliance</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            NotiFetch is built on solid legal foundations. Here&apos;s how we protect your rights and ours.
          </p>
        </div>
        <Card className="mb-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><Scale className="w-5 h-5 text-amber-500" /> Our Legal Foundation</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">NotiFetch operates under these legal principles:</p>
            <div className="space-y-3">
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium">Nominative Fair Use</p><p className="text-sm text-muted-foreground">Platform names used for identification only — Section 30 Trade Marks Act 1999, 15 U.S.C. § 1115(b)(4)</p></div></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium">User-Initiated Access</p><p className="text-sm text-muted-foreground">Users explicitly grant notification access via Android Settings. NotiFetch cannot enable this itself.</p></div></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium">No Platform Access</p><p className="text-sm text-muted-foreground">NotiFetch does not access, scrape, or interact with any delivery platform&apos;s app, API, or servers.</p></div></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium">User Choice Model</p><p className="text-sm text-muted-foreground">Users can customize all platform names. NotiFetch doesn&apos;t mandate any trademark.</p></div></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium">Data Minimization</p><p className="text-sm text-muted-foreground">Only notification text stored. No credentials/OTPs. 90-day auto-deletion. Delete anytime.</p></div></div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-8 border-amber-500/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400"><AlertTriangle className="w-5 h-5" /> Important Disclaimer</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm"><strong>NotiFetch is NOT affiliated with, endorsed by, authorized by, or connected to</strong> any delivery platform, including Swiggy, Zomato, Uber Eats, DoorDash, Amazon Flex, Blinkit, Zepto, or any other platform.</p>
            <p className="text-sm mt-3">All trademarks are property of their respective owners. Platform names are used for identification under nominative fair use. NotiFetch does not imply sponsorship or endorsement.</p>
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-amber-500" /> Compliance</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium text-sm">DPDP Act 2023</p><p className="text-xs text-muted-foreground">India data protection</p></div></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium text-sm">GDPR</p><p className="text-xs text-muted-foreground">EU data protection</p></div></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium text-sm">CCPA</p><p className="text-xs text-muted-foreground">California privacy</p></div></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium text-sm">Google Play</p><p className="text-xs text-muted-foreground">Policy compliant</p></div></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium text-sm">Trade Marks Act</p><p className="text-xs text-muted-foreground">Section 30 fair use</p></div></div>
              <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><div><p className="font-medium text-sm">IT Act 2000</p><p className="text-xs text-muted-foreground">Section 43A + 72A</p></div></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-amber-500" /> Legal Documents</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a href="/privacy" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"><span className="font-medium">Privacy Policy</span><span className="text-amber-500">→</span></a>
              <a href="/terms" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"><span className="font-medium">Terms of Service</span><span className="text-amber-500">→</span></a>
              <a href="/download" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"><span className="font-medium">Direct APK Download</span><span className="text-amber-500">→</span></a>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-2">Legal inquiries: <a href="mailto:legal@notifetch.app" className="text-amber-500 underline">legal@notifetch.app</a></p>
          <p className="text-xs text-muted-foreground">Data Protection Officer: Yashas K · Last updated: July 2026</p>
        </div>
      </main>
    </div>
  );
}
