"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { NAV_ITEMS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Zap, Menu, Moon, Sun, LogIn, LogOut, User, QrCode, Smartphone, Download, Play } from "lucide-react";
import { useTheme } from "next-themes";

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { setTheme } = useTheme();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const isLoggedIn = status === "authenticated" && session?.user;

  const handleLogoClick = () => {
    if (isLoggedIn) {
      window.location.href = "/dashboard";
    } else {
      handleNavClick("hero");
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                NotiFetch
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Play Store download button — always visible */}
              <a
                href="https://play.google.com/store/apps/details?id=com.notifetch.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-3 h-9 rounded-lg hover:bg-black/90 transition-colors"
                title="Download NotiFetch on Google Play"
              >
                <Play className="w-3 h-3 fill-white" />
                Get App
              </a>

              {/* QR Code button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQR(true)}
                className="h-9 w-9 text-muted-foreground hover:text-amber-500"
                aria-label="Show QR code"
              >
                <QrCode className="h-4 w-4" />
              </Button>

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const isDark = document.documentElement.classList.contains("dark");
                  setTheme(isDark ? "light" : "dark");
                }}
                className="h-9 w-9 relative"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = "/dashboard"}
                    className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">
                          {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="max-w-[100px] truncate text-sm">
                      {session.user.name || session.user.email?.split("@")[0]}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="hidden sm:flex text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = "/auth/signin"}
                    className="hidden sm:flex text-muted-foreground hover:text-foreground"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Sign In
                  </Button>
                  <Button
                    onClick={() => window.location.href = "/auth/signin"}
                    className="hidden sm:flex bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-amber-500/20"
                  >
                    Get Started
                  </Button>
                </>
              )}

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 bg-background">
                  <SheetTitle className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-amber-500">NotiFetch</span>
                  </SheetTitle>
                  <div className="flex flex-col gap-1">
                    {NAV_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                          activeSection === item.id
                            ? "bg-amber-500/10 text-amber-500"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="mt-4 pt-4 border-t border-border space-y-2">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.notifetch.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold px-4 h-10 rounded-lg hover:bg-black/90 transition-colors w-full"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Download on Play Store
                      </a>
                      {isLoggedIn ? (
                        <>
                          <div className="flex items-center gap-3 px-4 py-3">
                            {session.user.image ? (
                              <img
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                <span className="text-xs text-white font-bold">
                                  {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {session.user.name || "User"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {session.user.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => { window.location.href = "/dashboard"; setMobileOpen(false); }}
                            className="w-full"
                          >
                            <User className="w-4 h-4 mr-2" />
                            My Dashboard
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                            className="w-full"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => { window.location.href = "/auth/signin"; setMobileOpen(false); }}
                            className="w-full"
                          >
                            <LogIn className="w-4 h-4 mr-2" />
                            Sign In
                          </Button>
                          <Button
                            onClick={() => { window.location.href = "/auth/signin"; setMobileOpen(false); }}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
                          >
                            Get Started
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* QR Code Modal */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-500" />
              Install NotiFetch on Your Phone
            </DialogTitle>
            <DialogDescription>
              Scan this QR code with your phone camera to open NotiFetch, then tap &quot;Add to Home Screen&quot; to install it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="bg-white rounded-xl p-4">
              <img
                src="/qr-code.png"
                alt="QR code to install NotiFetch"
                className="w-56 h-56 rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Works on Android &amp; iOS browsers
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
