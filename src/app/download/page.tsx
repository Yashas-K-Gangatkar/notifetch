"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Shield, Smartphone, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { BackButton } from "@/components/back-button";

export default function DownloadPage() {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const handleDownload = () => {
    window.open("https://github.com/Yashas-K-Gangatkar/notifetch/releases/latest", "_blank");
    setDownloadStarted(true);
  };
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/" />
            <h1 className="text-lg font-bold">Download NotiFetch</h1>
          </div>
          <Badge variant="outline" className="text-green-500 border-green-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Official
          </Badge>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Download NotiFetch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Direct APK download — no Google Play account needed. Always download from notifetch.in.
          </p>
        </div>
        <Card className="mb-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><Download className="w-5 h-5 text-amber-500" /> Latest Version: v2.9.86</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Version</p><p className="font-medium">2.9.86 (Code 114)</p></div>
                <div><p className="text-muted-foreground">Size</p><p className="font-medium">~25 MB</p></div>
                <div><p className="text-muted-foreground">Android</p><p className="font-medium">7.0+ (API 24+)</p></div>
                <div><p className="text-muted-foreground">Target SDK</p><p className="font-medium">36 (Android 16)</p></div>
              </div>
              <Button size="lg" onClick={handleDownload} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold">
                <Download className="w-5 h-5 mr-2" /> Download APK
              </Button>
              {downloadStarted && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm">
                  <p className="font-medium text-amber-600 dark:text-amber-400 mb-1">Download started!</p>
                  <p className="text-muted-foreground">If it didn&apos;t start, <a href="https://github.com/Yashas-K-Gangatkar/notifetch/releases/latest" target="_blank" rel="noopener noreferrer" className="text-amber-500 underline">click here</a>.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardHeader><CardTitle>How to Install</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm font-bold">1</span><span>Download the APK file</span></li>
              <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm font-bold">2</span><span>Allow &quot;Install from unknown sources&quot; in settings</span></li>
              <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm font-bold">3</span><span>Tap &quot;Install&quot; when prompted</span></li>
              <li className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm font-bold">4</span><span>Open NotiFetch and follow onboarding</span></li>
            </ol>
          </CardContent>
        </Card>
        <Card className="mb-8 border-amber-500/30">
          <CardHeader><CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400"><AlertTriangle className="w-5 h-5" /> Security Information</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2"><Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Verified:</strong> SHA-1: <code className="text-xs">59:70:88:1E:B8:0B:CE:1B:F4:A8:0E:D2:35:C4:06:3E:99:89:F5:ED</code></span></p>
              <p className="flex items-start gap-2"><Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>Safe:</strong> Only download from notifetch.in or GitHub</span></p>
              <p className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" /><span><strong>Warning:</strong> Do not download from other websites</span></p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Also on Google Play</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Prefer the Play Store?</p>
            <a href="https://play.google.com/store/apps/details?id=com.notifetch.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white font-semibold px-6 h-11 rounded-xl hover:bg-black/90 transition-colors">
              <ExternalLink className="w-4 h-4" /> Get on Google Play
            </a>
          </CardContent>
        </Card>
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
            NotiFetch is not affiliated with any delivery platform. By installing, you agree to our <a href="/terms" className="underline hover:text-foreground">Terms</a> and <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
