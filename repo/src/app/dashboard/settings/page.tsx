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
import { Input } from "@/components/ui/input";
import {
  Zap, Settings, Moon, Sun, Bell, Globe, Info,
  ShoppingCart, Truck, Pill, Bike, Edit3, RotateCcw, Check, X, Tag,
  Shield, Download, Trash2
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { useTheme } from "next-themes";

interface NotificationSource {
  id: string;
  platformId: string;
  platformName: string;
  customName: string | null;
  category: string;
  packageName: string | null;
  listening: boolean;
  resolvedDisplayName: string;
}

interface Preferences {
  id: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  swiggyEnabled: boolean;
  zomatoEnabled: boolean;
  amazonEnabled: boolean;
}

// Category icons mapping
const categoryIcons: Record<string, typeof Zap> = {
  food: ShoppingCart,
  grocery: ShoppingCart,
  package: Truck,
  courier: Truck,
  "last-mile": Truck,
  ride: Bike,
  medical: Pill,
};

const categoryColors: Record<string, string> = {
  food: "text-amber-500",
  grocery: "text-green-500",
  package: "text-blue-500",
  courier: "text-indigo-500",
  "last-mile": "text-teal-500",
  ride: "text-purple-500",
  medical: "text-red-500",
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [platforms, setPlatforms] = useState<NotificationSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

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
    }
  }, []);

  const fetchPlatforms = useCallback(async () => {
    try {
      const res = await fetch("/api/platforms");
      if (res.ok) {
        const data = await res.json();
        setPlatforms(data.sources || []);
      }
    } catch {
      // Silently handle
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      Promise.all([fetchPrefs(), fetchPlatforms()]).finally(() => setIsLoading(false));
    }
  }, [status, fetchPrefs, fetchPlatforms]);

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

  const handleRenamePlatform = async (platformId: string, customName: string | null) => {
    try {
      const res = await fetch("/api/platforms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platformId, customName }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlatforms(prev => prev.map(p =>
          p.platformId === platformId
            ? { ...p, customName: data.source.customName, resolvedDisplayName: data.source.resolvedDisplayName }
            : p
        ));
      }
    } catch {
      // Silently handle
    }
    setEditingPlatform(null);
  };

  const startEditing = (platform: NotificationSource) => {
    setEditingPlatform(platform.platformId);
    setEditValue(platform.customName || platform.platformName);
  };

  const cancelEditing = () => {
    setEditingPlatform(null);
    setEditValue("");
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      cancelEditing();
      return;
    }
    // If same as default, reset to null
    const platform = platforms.find(p => p.platformId === editingPlatform);
    if (platform && trimmed === platform.platformName) {
      handleRenamePlatform(editingPlatform!, null);
    } else {
      handleRenamePlatform(editingPlatform!, trimmed);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center animate-pulse">
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
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

        {/* Notification Preferences */}
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
                { key: "swiggyEnabled", label: "Platform 136", icon: Zap, color: "text-amber-500" },
                { key: "zomatoEnabled", label: "Platform 137", icon: ShoppingCart, color: "text-red-500" },
                { key: "amazonEnabled", label: "Platform 64", icon: Truck, color: "text-teal-500" },
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

        {/* Platform Names — User Choice Customization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="w-5 h-5 text-amber-500" />
              Platform Names
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Legal disclaimer about user choice model */}
            <div className="bg-muted/50 rounded-lg p-3 flex gap-2">
              <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Default names use real brand names for easy identification. You can rename any platform
                to whatever you prefer — this is your choice. Tap the edit icon to customize the display name.
                NotiFetch is not affiliated with any delivery platform.
              </p>
            </div>

            {platforms.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No platforms enabled yet. Enable platforms from the dashboard to customize their names.
              </p>
            ) : (
              <div className="space-y-2">
                {platforms.map((platform) => {
                  const CategoryIcon = categoryIcons[platform.category] || Truck;
                  const colorClass = categoryColors[platform.category] || "text-amber-500";
                  const isCustom = platform.customName !== null;
                  const isEditing = editingPlatform === platform.platformId;

                  return (
                    <div
                      key={platform.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <CategoryIcon className={`w-4 h-4 ${colorClass} shrink-0`} />

                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 text-sm"
                              placeholder={platform.platformName}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit();
                                if (e.key === "Escape") cancelEditing();
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={saveEdit}
                            >
                              <Check className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={cancelEditing}
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {platform.resolvedDisplayName}
                            </span>
                            {isCustom && (
                              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                                custom
                              </Badge>
                            )}
                          </div>
                        )}

                        {!isEditing && (
                          <p className="text-xs text-muted-foreground truncate">
                            {isCustom
                              ? `Default: ${platform.platformName}`
                              : platform.packageName || platform.platformId}
                          </p>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => startEditing(platform)}
                            title="Rename platform"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
                          {isCustom && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleRenamePlatform(platform.platformId, null)}
                              title="Reset to default name"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Switch
                            checked={platform.listening}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                fetch("/api/platforms", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    platformId: platform.platformId,
                                    platformName: platform.platformName,
                                    category: platform.category,
                                    packageName: platform.packageName,
                                  }),
                                }).then(() => fetchPlatforms());
                              } else {
                                fetch(`/api/platforms?platformId=${platform.platformId}`, {
                                  method: "DELETE",
                                }).then(() => fetchPlatforms());
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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

        {/* Data Rights — DPDP Act & GDPR */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-amber-500" />
              Your Data Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Under India DPDP Act 2023 (Sections 8-10), EU GDPR (Articles 15-22), and CCPA (Sections 1798.100-125),
              you have the right to access, export, correct, and delete your personal data at any time.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export My Data
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Download all your data in JSON format (GDPR Art. 20)
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/user/export");
                      if (res.ok) {
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `notifetch-data-export-${new Date().toISOString().split("T")[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }
                    } catch {
                      // Handle error
                    }
                  }}
                >
                  Export
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2 text-red-500">
                    <Trash2 className="w-4 h-4" />
                    Delete All My Data
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Permanently erase everything. This cannot be undone. (DPDP §8(5), GDPR Art. 17)
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    const confirmed = window.confirm(
                      "This will permanently delete ALL your data — notifications, settings, account. This cannot be undone.\n\nWe recommend exporting your data first.\n\nType DELETE_MY_DATA to confirm (in the next prompt)."
                    );
                    if (!confirmed) return;

                    const confirmation = window.prompt('Type "DELETE_MY_DATA" to confirm permanent deletion:');
                    if (confirmation !== "DELETE_MY_DATA") {
                      if (confirmation !== null) {
                        alert("Confirmation did not match. Your data was NOT deleted.");
                      }
                      return;
                    }

                    try {
                      const res = await fetch("/api/user/delete", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ confirm: "DELETE_MY_DATA" }),
                      });
                      if (res.ok) {
                        alert("All your data has been permanently deleted.");
                        window.location.href = "/auth/signin";
                      } else {
                        const data = await res.json();
                        alert(data.error || "Failed to delete data.");
                      }
                    } catch {
                      alert("Failed to delete data. Please try again or contact dpo@notifetch.app");
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
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
            <Separator />
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-xs text-red-500 font-medium">
                NotiFetch is NOT affiliated with, endorsed by, or connected to any delivery platform
                . Platform numbers are used for identification
                only and are customizable by the user. You are responsible for complying with each
                platform&apos;s terms of service.
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              NotiFetch reads delivery notifications from your device using Android&apos;s
              NotificationListenerService. We never access delivery platform APIs or store credentials.
              Platform display names are customizable by the user.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
