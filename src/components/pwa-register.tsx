'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWARegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Activate a waiting service worker update
  const activateUpdate = useCallback(() => {
    const reg = registrationRef.current;
    if (!reg?.waiting) return;

    // Tell the waiting service worker to skip waiting and become active
    reg.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload once the new controller takes over
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }, []);

  // Register service worker on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service workers not supported');
      return;
    }

    async function registerSW() {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        registrationRef.current = reg;
        console.log('[PWA] Service worker registered:', reg.scope);

        toast.success('App ready for offline use', {
          description: 'NotiFetch service worker is active.',
          duration: 4000,
        });

        // Check for updates periodically
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              setUpdateAvailable(true);
              toast.info('Update available', {
                description: 'A new version of NotiFetch is available.',
                action: {
                  label: 'Update',
                  onClick: () => activateUpdate(),
                },
                duration: 10000,
              });
            }
          });
        });

        // Initial check for waiting service worker
        if (reg.waiting && navigator.serviceWorker.controller) {
          setUpdateAvailable(true);
        }
      } catch (error) {
        console.error('[PWA] Service worker registration failed:', error);
        toast.error('Offline mode unavailable', {
          description: 'Service worker could not be registered.',
          duration: 5000,
        });
      }
    }

    registerSW();
  }, [activateUpdate]);

  // Request notification permission
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;

    // Only ask if we haven't already decided
    if (Notification.permission === 'default') {
      // Delay the permission request slightly so it doesn't conflict with SW registration
      const timer = setTimeout(() => {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('[PWA] Notification permission granted');
            toast.success('Notifications enabled', {
              description: 'You will receive order updates and delivery alerts.',
              duration: 3000,
            });
          } else if (permission === 'denied') {
            console.log('[PWA] Notification permission denied');
          }
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      console.log('[PWA] Install prompt captured');
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Prompt the user to install the PWA
  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const result = await installPrompt.userChoice;

    if (result.outcome === 'accepted') {
      toast.success('App installed!', {
        description: 'NotiFetch has been added to your home screen.',
        duration: 4000,
      });
    }

    setInstallPrompt(null);
  }, [installPrompt]);

  return (
    <>
      {/* Update banner */}
      {updateAvailable && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg border border-amber-500/30 bg-amber-950/90 p-4 shadow-2xl backdrop-blur-sm sm:left-auto sm:right-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-400">Update available</p>
              <p className="text-xs text-amber-200/70">A new version of NotiFetch is ready.</p>
            </div>
            <button
              onClick={activateUpdate}
              className="shrink-0 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-amber-400"
            >
              Update now
            </button>
          </div>
        </div>
      )}

      {/* Install prompt banner */}
      {installPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg border border-emerald-500/30 bg-emerald-950/90 p-4 shadow-2xl backdrop-blur-sm sm:left-auto sm:right-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-400">Install NotiFetch</p>
              <p className="text-xs text-emerald-200/70">Add to your home screen for the best experience.</p>
            </div>
            <button
              onClick={handleInstall}
              className="shrink-0 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-emerald-400"
            >
              Install
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PWARegister;
