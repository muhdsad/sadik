# Sadik Hub - Android Application

This directory contains the complete native Android project for **Mohammed Sadique Hub & Personal Workspace**.

## Features Included in the Android Project

- **Native WebView with `WebViewAssetLoader`**: Loads assets securely through `https://appassets.androidplatform.net/assets/www/index.html` preventing origin/CORS problems and preserving `localStorage` state (theme, preferences).
- **Integrated Pull-to-Refresh**: Native Android `SwipeRefreshLayout` lets you swipe down to reload the dashboard or active workspace.
- **Progress Indicator**: Clean gradient progress bar at the top during page transitions.
- **Smart Android Back Navigation**:
  - Exits fullscreen views if active.
  - Collapses/closes the workspace iframe if open.
  - Navigates back through history if available.
  - Requires double-tap to exit the app.
- **External Intent Handling**: Safely delegates `tel:`, `mailto:`, `whatsapp:`, and standard external app intents to native Android apps.
- **Upload / File Chooser Support**: Seamlessly enables `<input type="file">` for creative apps (e.g., Photopea, graphic editors).
- **Branded App Icons**: High-res mipmap launcher icons (`ic_launcher` and `ic_launcher_round`) generated across all standard Android screen densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi).
- **Safe Area Insets**: Notch and status-bar safe edge-to-edge layout.

---

## How to Open & Build the App

### Option A: Using Android Studio (Recommended)

1. Open **Android Studio**.
2. Select **Open** and choose the `android` folder (`/home/sadik/Downloads/sadikhome/android`).
3. Android Studio will automatically sync the Gradle project and download dependencies.
4. Connect an Android phone via USB (with Developer options & USB Debugging enabled) or start an Android Emulator.
5. Click the green **Run ▶** button (or press `Shift + F10`).

### Option B: Build APK via Terminal / Gradle

```bash
cd android
./gradlew assembleDebug
```

The compiled APK will be generated at:
```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Install it directly to a connected phone using ADB:
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## Syncing Web Changes

If you make modifications to `index.html`, `styles.css`, or `scripts.js` in the root folder, run:

```bash
# From the root directory:
./sync-assets.sh
# or using npm:
npm run sync
```
This updates `android/app/src/main/assets/www/` instantly.
