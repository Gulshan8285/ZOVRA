# ZOVRA 2026 – Production Deployment Guide

## 1. Google Play Console (Android)

### App Bundle (AAB) Location
The release Android App Bundle is built and signed:
- **AAB Path**: `/Users/gulshanyadav/Desktop/Zovra App/build/app/outputs/bundle/release/app-release.aab`
- **Package Name**: `com.zovra.zovra`
- **Target SDK**: Android 16 / 15 / 14 (API 34–36)
- **Min SDK**: API 21 (Android 5.0+)
- **Size**: ~134 MB

### Direct APK Location
For offline sideloading and instant physical phone testing:
- **Debug APK**: `/Users/gulshanyadav/Desktop/Zovra App/build/app/outputs/flutter-apk/app-debug.apk`
- **Release APK**: `/Users/gulshanyadav/Desktop/Zovra App/build/app/outputs/flutter-apk/app-release.apk`

### Play Store Upload Steps
1. Log in to [Google Play Console](https://play.google.com/console).
2. Create or select application **ZOVRA**.
3. Under **Production** > **Releases**, click **Create new release**.
4. Drag and drop `app-release.aab`.
5. Release Name: `1.0.0 (2026-v1)`.
6. Add release notes highlighting:
   - 10 Specialized in-home massage therapies
   - Live stage tracking with push updates
   - Transparent pricing & instant WhatsApp booking sharing
7. Save and submit for review.

---

## 2. Apple App Store (iOS)

### Build Command
```bash
flutter build ipa --release
```
### Fastlane / Xcode Archiving
1. Open `/Users/gulshanyadav/Desktop/Zovra App/ios/Runner.xcworkspace` in Xcode.
2. Ensure bundle identifier is configured as `com.zovra.zovra`.
3. Select generic iOS device: `Product > Archive`.
4. Distribute App > App Store Connect > Upload.
5. Set up internal & external test groups on TestFlight.

---

## 3. Vercel Deployment (Web Store & Admin Dashboard)

### Live Production Deployment
- **Live URL**: `https://zovra.vercel.app`
- **Admin Dashboard**: `https://zovra.vercel.app/admin`
- **Vercel Project**: `zovra` (Project ID: `prj_lY1BBcnkMBKu5f0TRUSOEFygAPmF`)
- **Git Remote**: `git@github.com:Gulshan8285/ZOVRA.git` (branch `main`)

### Automated Continuous Deployment
Every commit pushed to the `main` branch of `Gulshan8285/ZOVRA` triggers an automated Vercel production deployment:
```bash
cd "/Users/gulshanyadav/Desktop/ZOVRA Website"
git add .
git commit -m "feat: ZOVRA 2026 Midnight Black UI and Admin CRM upgrade"
git push origin main
```
Vercel automatically compiles, runs typechecks, generates static pages, and deploys globally with instant edge caching.
