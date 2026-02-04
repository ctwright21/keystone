# Keystone — Favicon & Logo Integration Guide

## Files Included

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | Multi-size | Classic favicon (16/32/48px) |
| `favicon.svg` | Scalable | Modern browsers, scales perfectly |
| `favicon-16x16.png` | 16×16 | Legacy browsers |
| `favicon-32x32.png` | 32×32 | Standard favicon |
| `favicon-48x48.png` | 48×48 | Windows taskbar |
| `apple-touch-icon.png` | 180×180 | iOS home screen (with dark bg) |
| `android-chrome-192x192.png` | 192×192 | Android home screen |
| `android-chrome-512x512.png` | 512×512 | Android splash / PWA |
| `mstile-150x150.png` | 150×150 | Windows tiles |
| `site.webmanifest` | — | PWA manifest |
| `keystone-icon.svg` | Scalable | Full-res logo mark for app use |
| `keystone-logo-full.svg` | Scalable | Logo mark + KEYSTONE wordmark |

---

## HTML Head Integration

Add this to your `<head>` tag:

```html
<!-- Keystone Favicons -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileImage" content="/mstile-150x150.png">
<meta name="msapplication-TileColor" content="#0A0A0F">
<meta name="theme-color" content="#00F0FF">
```

---

## File Placement

### Next.js / React
Place all files in `public/`:
```
public/
  favicon.ico
  favicon.svg
  favicon-16x16.png
  favicon-32x32.png
  favicon-48x48.png
  apple-touch-icon.png
  android-chrome-192x192.png
  android-chrome-512x512.png
  mstile-150x150.png
  site.webmanifest
```

### Standard HTML
Place all files in your root directory alongside `index.html`.

---

## Using the Logo in Components

### As an img tag
```html
<img src="/keystone-icon.svg" alt="Keystone" width="40" height="40">
```

### As a React component (inline SVG)
```jsx
const KeystoneIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none">
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00F0FF"/>
        <stop offset="100%" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
    <path d="M256 24 L480 138 L480 330 L256 488 L32 330 L32 138 Z"
      fill="none" stroke="url(#shieldGrad)" strokeWidth="28" strokeLinejoin="round"/>
    <path d="M272 128 L202 272 L258 272 L222 384 L316 244 L260 244 L296 128 Z"
      fill="url(#shieldGrad)"/>
  </svg>
);
```

---

## Brand Colors Reference

| Token | Hex | Usage |
|-------|-----|-------|
| Primary (Cyan) | `#00F0FF` | Theme color, active states |
| Secondary (Violet) | `#8B5CF6` | Gradient end, secondary accent |
| Background | `#0A0A0F` | App background, tile color |
