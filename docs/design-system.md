# NotiFetch Design System

**Version:** 2.9.74 (Liquid Glass)
**Last Updated:** July 8, 2026
**Single Source of Truth:** This document defines all visual tokens, component specs, and usage guidelines for NotiFetch.

---

## 1. Color Tokens

### Background
| Token | Value | Usage |
|-------|-------|-------|
| `LiquidBackground` | `#0B0F14` | App background (deep dark with blue tint) |
| `LiquidSurface` | `#111820` | Solid surface (fallback for non-glass) |
| `LiquidSurfaceVariant` | `#1A2330` | Subtle elevated surface |

### Accent
| Token | Value | Usage |
|-------|-------|-------|
| `LiquidAccent` | `#00D9FF` | Primary accent (cyan) — buttons, active states |
| `LiquidAccentDim` | `#0099B8` | Dimmed accent for inactive/disabled |
| `LiquidSuccess` | `#22C55E` | Success states |
| `LiquidWarning` | `#F59E0B` | Warning states |
| `LiquidError` | `#EF4444` | Error states |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `LiquidTextPrimary` | `#FFFFFF` | Primary text (high contrast) |
| `LiquidTextSecondary` | `#B0BEC5` | Secondary text |
| `LiquidTextTertiary` | `#78909C` | Tertiary/muted text |

### Glass
| Token | Value | Usage |
|-------|-------|-------|
| `GlassWhite` | `#FFFFFF` | Base color for glass tint |
| `GlassHighlight` | `#FFFFFF` | Border + specular highlight |

---

## 2. Typography

Uses Material 3 `Typography` with `FontFamily.Default` (Roboto).

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| `displayLarge` | 57sp | 400 | Hero numbers (countdown) |
| `headlineMedium` | 32sp | 400 | Screen titles |
| `headlineSmall` | 24sp | 400 | Card titles |
| `titleLarge` | 22sp | 400 | Section headers |
| `titleMedium` | 16sp | 500 | Card headers |
| `titleSmall` | 14sp | 500 | Subsection headers |
| `bodyLarge` | 16sp | 400 | Primary body text |
| `bodyMedium` | 14sp | 400 | Secondary body text |
| `bodySmall` | 12sp | 400 | Tertiary body text |
| `labelMedium` | 12sp | 500 | Button text |
| `labelSmall` | 11sp | 500 | Chips, badges |

---

## 3. Corner Radius

| Component | Radius | Token |
|-----------|--------|-------|
| Glass cards | 24dp | `theme.cornerRadius` |
| Buttons | 20dp | `theme.cornerRadius - 4.dp` |
| Bottom nav | 0dp (full width) | — |
| Chips | 16dp | — |
| Icons | Circle / 12dp | — |
| Dialogs | 28dp | — |

---

## 4. Glass Opacity

| Mode | Tint | Border | Noise | Highlight |
|------|------|--------|-------|-----------|
| FLAGSHIP (API 31+) | 0.12 | 0.12 | 0.04 | 0.45 |
| BALANCED (API 26-30) | 0.18 | 0.12 | 0.05 | 0.35 |
| COMPATIBILITY (API 24-25) | 0.22 | 0.15 | 0.00 | 0.00 |

---

## 5. Elevation Levels

| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | 0dp | Flat elements (background) |
| 1 | 2dp | Bottom nav, outlined buttons |
| 2 | 4dp | Notification cards (balanced mode) |
| 3 | 8dp | Glass cards (flagship mode) |
| 4 | 12dp | Dialogs, bottom sheets |

---

## 6. Blur Values

| Layer | Radius | Mode | Notes |
|-------|--------|------|-------|
| Shared background (static) | 24dp | FLAGSHIP only | GPU-accelerated via `Modifier.blur()` |
| Dialog backdrop | 48dp | FLAGSHIP only | OS-level via `window.setBackgroundBlurRadius()` |
| No per-card blur | — | All modes | Requirement: one shared layer |

---

## 7. Motion Principles

### Spring Config
| Property | Value | Usage |
|----------|-------|-------|
| `dampingRatio` | 0.6 | Button press, card tap |
| `stiffness` | 400 | Button press, card tap |
| `pressScale` | 0.96 | Primary buttons |
| `pressScale` | 0.97 | Outlined buttons |

### Animation Durations
| Animation | Duration | Easing |
|-----------|----------|--------|
| Gradient drift | 8000ms | Linear (Reverse) |
| Screen transitions | 300ms | EaseInOut |
| Dialog appear | 200ms | Spring |
| Snackbar | 300ms | EaseInOut |
| Countdown update | 1000ms | — (tick) |

### Rules
- Never snap. Everything glides.
- Use spring for interactive elements (buttons, cards).
- Use tween for non-interactive transitions (screen changes).
- Infinite animations must respect battery saver (`ANIMATOR_DURATION_SCALE = 0`).

---

## 8. Component Usage Guidelines

### GlassSurface
- Use for: cards, panels, top bar, bottom nav
- Do NOT use for: text, icons, individual list items < 48dp height
- Always read from `currentGlassTheme` — never hardcode values

### GlassCard
- Use for: content sections, notification items, settings groups
- Padding: 16dp default
- Do NOT nest GlassCards inside GlassCards

### GlassButton
- Use for: primary actions (Submit, Open App, Send)
- Min height: 48dp (Material 3 touch target)
- Do NOT use for: navigation (use NavigationBarItem)

### GlassOutlinedButton
- Use for: secondary actions (Cancel, Skip, Later)
- Min height: 48dp
- Do NOT use for: primary actions

---

## 9. Accessibility Rules

- Text contrast: minimum 4.5:1 (WCAG AA)
- Glass opacity: never below 0.08 (text becomes unreadable)
- Touch targets: minimum 48dp × 48dp
- All buttons: `role = Role.Button` via `Modifier.semantics`
- All interactive elements: must have `contentDescription`
- Dynamic font scaling: must support up to 200%
- Dark mode: pure black background (#0B0F14) with white text
- Reduced motion: respect `Settings.Global.ANIMATOR_DURATION_SCALE`

---

## 10. Do's and Don'ts

### ✅ Do
- Read all glass values from `GlassThemeConfig` via `currentGlassTheme`
- Use `GlassSurface` for any surface that should look like glass
- Use `interactionSource` for press states (not manual `pointerInput`)
- Cache noise texture and brushes (use `remember`)
- Use `drawWithCache` for custom drawing to avoid per-frame allocation
- Test on at least 3 API levels: 24, 29, 34

### ❌ Don't
- Hardcode blur radius, opacity, corner radius, or noise strength
- Use `RenderEffect.createBlurEffect` directly — use `Modifier.blur()`
- Create per-card blur layers — use the shared `SharedBlurBackground`
- Use `AndroidView` for graphics — use Compose Canvas / `drawWithCache`
- Animate blurred layers — blur is expensive, keep it static
- Nest glass surfaces — max 2 layers of glass visible at once
- Use orange `BrandGradientStart/End` — replaced by `LiquidAccent` cyan

---

## 11. Rendering Modes

| Mode | API | Blur | Noise | Highlight | Shadow | Target FPS |
|------|-----|------|-------|-----------|--------|------------|
| FLAGSHIP | 31+ | ✅ 24dp | ✅ 0.04 | ✅ 0.45 | 8dp | 90-120 |
| BALANCED | 26-30 | ❌ | ✅ 0.05 | ✅ 0.35 | 4dp | 60 |
| COMPATIBILITY | 24-25 | ❌ | ❌ | ❌ | 2dp | 60 |

Auto-detect: `detectGlassMode()` in `GlassTheme.kt`

---

## 12. Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Overdraw | < 3x on main screen | GPU profiler |
| Scroll FPS | 60 mid-range, 90-120 flagship | Perfetto / systrace |
| Startup time | < 1.5s cold start | `adb shell am start -W` |
| Memory | < 5MB for glass system | Android Profiler |
| Battery | < 1% per hour | Battery historian |
| Recomposition | 0 unnecessary per scroll | Compose Compiler Metrics |
