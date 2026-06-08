"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Zap, Settings, Moon, Sun, Bell, Globe, Info,
  ShoppingCart, Truck, Pill, Bike
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { useTheme } from "next-themes";

interface Preferences {
  id: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  swiggyEnabled: boolean;
  zomatoEnabled: boolean;
  amazonEnabled: boolean;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchPrefs = useCallback(async () => {
    try {
      const res = await fetch("/api/preferences");
      if (res.ok) {
        const data = await res.json();
        setPrefs(data.preferences);
      }
    } catch {
      // Silently handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPrefs();
    }
  }, [status, fetchPrefs]);

  const updatePref = async (key: string, value: boolean) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      if (res.ok) {
        const data = await res.json();
        setPrefs(data.preferences);

        // Apply dark mode change immediately
        if (key === "darkMode") {
          setTheme(value ? "dark" : "light");
        }
      }
    } catch {
      // Silently handle
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Loading settings...</span>
        </div>
      </div>
    );
  }

  if (!prefs) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/dashboard" />
            <h1 className="text-lg font-bold">Settings</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Moon className="w-5 h-5 text-amber-500" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  Dark Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light");
                  updatePref("darkMode", checked);
                }}
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-amber-500" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Push Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive push notifications for new alerts
                </p>
              </div>
              <Switch
                checked={prefs.notificationsEnabled}
                onCheckedChange={(checked) => updatePref("notificationsEnabled", checked)}
                disabled={isSaving}
              />
            </div>
            <Separator />
            <p className="text-sm font-medium text-muted-foreground">Platform Filters</p>
            <p className="text-xs text-muted-foreground">
              Choose which platforms you want to receive notifications from.
            </p>
            <div className="space-y-3">
              {[
                { key: "swiggyEnabled", label: "Swiggy", icon: Zap, color: "text-amber-500" },
                { key: "zomatoEnabled", label: "Zomato", icon: ShoppingCart, color: "text-red-500" },
                { key: "amazonEnabled", label: "Amazon", icon: Truck, color: "text-teal-500" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    {item.label}
                  </Label>
                  <Switch
                    checked={prefs[item.key as keyof Preferences] as boolean}
                    onCheckedChange={(checked) => updatePref(item.key, checked)}
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-amber-500" />
              Language &amp; Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Language</Label>
                <p className="text-xs text-muted-foreground">
                  App display language
                </p>
              </div>
              <Badge variant="outline">English</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Region</Label>
                <p className="text-xs text-muted-foreground">
                  Your delivery region
                </p>
              </div>
              <Badge variant="outline">India</Badge>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="w-5 h-5 text-amber-500" />
              About NotiFetch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span>1.0.0</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Build</span>
              <span>Production</span>
            </div>
            <Separator />
            <div className="flex gap-4">
              <a href="/privacy" className="text-amber-500 hover:text-amber-400 text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="text-amber-500 hover:text-amber-400 text-sm">
                Terms of Service
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              NotiFetch reads delivery notifications from your device using Android&apos;s
              NotificationListenerService. We never access delivery platform APIs or store credentials.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
