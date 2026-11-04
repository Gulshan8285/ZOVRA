# ZOVRA 2026 – System Architecture & Setup Guide

## 1. Project Overview
ZOVRA is an ultra-premium, production-ready on-demand male home-service and spa booking platform inspired by the UX simplicity of Urban Company, the fluid glass aesthetic of Apple, and the floating navigation of Uber.

### Strict Brand Identity
- **Primary Background**: Deep Midnight Black (`#080A0F`, `#0D121D`)
- **Secondary Surfaces**: Dark Navy Glass (`#111827`, `#141C2E`)
- **Accent & Glow**: Electric Blue / Icy Blue (`#00D2FF`, `#38BDF8`)
- **Watermark Identity**: `ZOVRA.com`
- **Strict Brand Rule**: Absolutely **NO ORANGE** as primary color.

---

## 2. Workspaces & Repositories

| Component | Local Directory | Tech Stack | Production URL / Build |
|-----------|-----------------|------------|------------------------|
| **Flutter Mobile App** | `/Users/gulshanyadav/Desktop/Zovra App` | Flutter 3.47.5, Dart 3.13.4, Riverpod, GoRouter | APK & AAB (`app-release.aab`, `app-release.apk`) |
| **Web App & Admin** | `/Users/gulshanyadav/Desktop/ZOVRA Website` | Next.js 15.1.12, React 19, TypeScript, Tailwind | `https://zovra.vercel.app` |

---

## 3. Flutter Mobile App Local Setup

### Prerequisites
- Flutter SDK `^3.47.0` (with Android toolchain & Java 17)
- Android SDK Platform `android-36` / `android-37`
- Android NDK `28.2.13676358` or `27.1.12297006`

### Running on Physical Device (Samsung Galaxy A35)
1. Enable USB Debugging on your device (`Settings > Developer Options > USB Debugging`).
2. Connect phone via USB cable to Mac.
3. Verify connection via ADB:
   ```bash
   adb devices -l
   # List of devices attached
   # RZGYA043VYY  device product:a35xjvins model:SM_A356E
   ```
4. Install dependencies:
   ```bash
   cd "/Users/gulshanyadav/Desktop/Zovra App"
   flutter pub get
   ```
5. Run unit tests & static analysis:
   ```bash
   flutter test
   flutter analyze
   ```
6. Launch in debug mode directly on connected Samsung device:
   ```bash
   flutter run -d RZGYA043VYY
   ```
7. Or install pre-built release APK directly:
   ```bash
   adb install -r build/app/outputs/flutter-apk/app-debug.apk
   ```

---

## 4. Web Admin Dashboard & Backend Local Setup

### Prerequisites
- Node.js `^18.18.0` or `^20.x`
- npm `^10.x`

### Steps
1. Navigate to website repository:
   ```bash
   cd "/Users/gulshanyadav/Desktop/ZOVRA Website"
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` for customer web store and `http://localhost:3000/admin` for Operations & Dispatch control.
3. Master Admin Passphrase:
   ```
   zovra2026
   ```
4. Build production bundle:
   ```bash
   npm run build
   ```
