# Task 3 - Agent: Super Z (Main)

## Task: Fix dark mode, consolidate pricing, fix platform selection, improve Razorpay errors, remove fake data

## Changes Made

### 1. Dark Mode Fixes (8 files)
- **src/app/dashboard/page.tsx**: `bg-white` → `bg-card`, `text-gray-500/bg-gray-500/10` → `text-muted-foreground/bg-muted`, GENERAL category colors
- **src/app/dashboard/notifications/page.tsx**: GENERAL category color fix
- **src/components/navbar.tsx**: `bg-white` → `bg-card` for QR modal
- **src/components/push-permission.tsx**: Replaced all hardcoded dark-mode-only colors (zinc-950, amber-950, emerald-950, red-950) with theme-aware classes; `text-black` → `text-white`
- **src/components/pwa-register.tsx**: `bg-amber-950/90` → `bg-amber-500/10`, `bg-emerald-950/90` → `bg-emerald-500/10`, `text-black` → `text-white`
- **src/components/pwa-install-prompt.tsx**: `bg-white` → `bg-card`

### 2. Platform Selection UX Restructure (subscribe page)
- Moved platform selection section BEFORE plan cards
- Added guidance banner for free plan users
- Added upgrade preview message when paid plan is selected
- Removed `opacity-60` dimming from current plan card
- Changed "Current" badge to outline variant
- Added section heading before plan cards
- Fixed `isDowngrade` function reference ordering

### 3. Razorpay Error Message
- Added 503 status check and "not configured" detection
- Shows helpful configuration instructions

### 4. Verified No Fake Data
- All dashboard data comes from API calls
- Only reference/config data (PLATFORM_COLORS, etc.) exists

## Files Modified
- src/app/dashboard/page.tsx
- src/app/dashboard/notifications/page.tsx
- src/app/dashboard/subscribe/page.tsx
- src/components/navbar.tsx
- src/components/push-permission.tsx
- src/components/pwa-register.tsx
- src/components/pwa-install-prompt.tsx
- src/components/razorpay-checkout.tsx
