# Mohammed Sadique - Personal Workspace & Digital Hub (Web & Android)

A modern, responsive personal digital workspace and application launcher dashboard designed with clean glassmorphic UI, real-time search, category filters, dark/light theme switching, interactive workspace iframe viewer, and a **native Android app**.

## Features

- **Application Launcher**: Quick access to personal web apps, creative/graphic editors, and media links.
- **Split-View Workspace**: Live interactive embedded preview window with controls (reload, expand/collapse, open externally).
- **Instant Search & Filter**: Real-time filtering with tag matching and category filtering (`All`, `Personal Apps`, `AI & Tools`, `Media & Web`).
- **Keyboard Shortcuts**: Focus search quickly with `Cmd + K`, `Ctrl + K`, or `/`.
- **Dynamic Theming**: Light and Dark mode toggle with persistent state and automatic system preference detection.
- **Responsive Design**: Mobile-optimized layout with adaptive navigation drawer and touch-friendly controls.
- **Android App Support**: Ready-to-build Android Studio project with `WebViewAssetLoader`, swipe-to-refresh, hardware acceleration, file chooser, and back navigation.
- **Progressive Web App (PWA)**: Installable directly from Android Chrome via `manifest.webmanifest` and service worker caching.

## Project Structure

```text
├── android/              # Native Android Studio Project
│   ├── app/              # App module (MainActivity.kt, AndroidManifest.xml, assets, res)
│   ├── build.gradle.kts  # Root Gradle build script
│   └── settings.gradle.kts
├── index.html            # Main dashboard markup and semantic structure
├── styles.css            # Responsive styling, design tokens, and theme definitions
├── scripts.js           # App interactions, search, filter, and workspace logic
├── manifest.webmanifest  # Web App Manifest for PWA and Android installation
├── sw.js                 # Service worker for offline caching
├── sync-assets.sh        # Syncs web assets to android/app/src/main/assets/www
├── icon-192.png          # App icon (192x192)
├── icon-512.png          # High-res app icon (512x512)
├── logo.png              # Hub brand logo
├── txt.jpg               # Arabic calligraphy artwork banner
├── adiyath.jpg           # Workspace background artwork
├── package.json          # Convenient npm build & sync scripts
└── README.md             # Project documentation
```

## Running as an Android App

### Method 1: Android Studio (Recommended)
1. Open **Android Studio**.
2. Select **Open** and choose the `android` folder in this repository.
3. Wait for Gradle sync to complete.
4. Click **Run ▶** to test on an Android emulator or connected device.

### Method 2: Command Line (Build APK)
```bash
cd android
./gradlew assembleDebug
```
The APK will be generated at `android/app/build/outputs/apk/debug/app-debug.apk`.

### Method 3: Install via Mobile Chrome (PWA)
1. Serve the dashboard (`npx serve .` or host it on Netlify/Vercel/GitHub Pages).
2. Open the URL in Google Chrome on your Android device.
3. Tap the browser menu (⋮) -> **Install App** or **Add to Home screen**.

## Updating Assets
Whenever you edit `index.html`, `styles.css`, or `scripts.js`, update the Android assets by running:
```bash
./sync-assets.sh
# or
npm run sync
```
