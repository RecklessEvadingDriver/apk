# Capacitor APK Generation Guide

This guide explains how to generate an Android APK from the MovieStream app.

## Prerequisites

1. **Node.js and npm** - Already installed
2. **Android Studio** - Download from [developer.android.com](https://developer.android.com/studio)
3. **JDK 11 or higher** - Usually included with Android Studio
4. **Capacitor CLI** - Will be installed via npm

## Step-by-Step Instructions

### 1. Install Capacitor Dependencies

```bash
cd movie-streaming-app
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 2. Configure Next.js for Static Export

Update `next.config.ts` to use static export mode:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static HTML export
  images: {
    unoptimized: true,  // Required for static export
  },
  trailingSlash: true,  // Better compatibility
};

export default nextConfig;
```

**Note**: Static export means no server-side API routes. You'll need to call the MovieBox API directly from the client or deploy the Next.js app separately and use it as an API backend.

### 3. Build the Next.js App

```bash
npm run build
```

This creates an `out` directory with static files.

### 4. Initialize Capacitor (First Time Only)

```bash
npx cap init MovieStream com.moviestream.app --web-dir=out
```

This creates a `capacitor.config.json` file (already included).

### 5. Add Android Platform

```bash
npx cap add android
```

This creates an `android` directory with the Android project.

### 6. Sync Web Files to Android

After any changes to your web app:

```bash
npm run build
npx cap sync android
```

### 7. Open in Android Studio

```bash
npx cap open android
```

This opens the project in Android Studio.

### 8. Build APK in Android Studio

#### Debug APK (for testing)

1. In Android Studio, go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for the build to complete
3. Click "locate" in the notification to find the APK
4. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Release APK (for distribution)

1. In Android Studio, go to **Build → Generate Signed Bundle / APK**
2. Select **APK**
3. Create a new keystore or use an existing one:
   - **Keystore path**: Choose a location (e.g., `my-release-key.keystore`)
   - **Password**: Create a password
   - **Alias**: Create an alias (e.g., `my-key-alias`)
   - Fill in certificate information
4. Select **release** build variant
5. Click **Finish**
6. APK location: `android/app/build/outputs/apk/release/app-release.apk`

### 9. Install APK on Device

#### Via ADB (Android Debug Bridge)

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### Via File Transfer

1. Copy the APK to your device
2. Open the APK file on your device
3. Allow installation from unknown sources if prompted
4. Install the app

## Alternative: Build from Command Line

### Debug Build

```bash
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release Build

First, create `android/key.properties`:

```properties
storePassword=your-keystore-password
keyPassword=your-key-password
keyAlias=your-key-alias
storeFile=../my-release-key.keystore
```

Then build:

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

## Important Configuration Files

### AndroidManifest.xml

Location: `android/app/src/main/AndroidManifest.xml`

Add necessary permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### build.gradle

Location: `android/app/build.gradle`

Customize:
- `versionCode`: Increment for each release
- `versionName`: User-visible version (e.g., "1.0.0")
- `minSdkVersion`: Minimum Android version (default: 22)
- `targetSdkVersion`: Target Android version (default: 34)

## Optimization Tips

### Reduce APK Size

1. **Enable ProGuard** in `android/app/build.gradle`:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

2. **Use WebP images** instead of PNG/JPG
3. **Enable app bundle** instead of APK for Google Play

### Performance Optimization

1. **Enable hardware acceleration** in `AndroidManifest.xml`:

```xml
<application android:hardwareAccelerated="true">
```

2. **Use SplashScreen** for better perceived performance (already configured)

## Troubleshooting

### Build Fails

**Error**: "SDK location not found"
- **Solution**: Open Android Studio → SDK Manager → Install Android SDK

**Error**: "Gradle sync failed"
- **Solution**: Update Gradle wrapper:
  ```bash
  cd android
  ./gradlew wrapper --gradle-version=8.0
  ```

### App Crashes on Launch

**White screen / blank screen**
- **Solution**: Ensure `output: 'export'` is in `next.config.ts`
- Check `capacitor.config.json` has correct `webDir: "out"`

**Network errors**
- **Solution**: Add INTERNET permission to AndroidManifest.xml
- Check that the API URLs are accessible

### Video Playback Issues

**Videos don't play**
- **Solution**: Add video codecs to Android project
- Test with different video formats (MP4 usually works best)

## Publishing to Google Play Store

1. **Prepare assets**:
   - App icon (512x512 PNG)
   - Feature graphic (1024x500 PNG)
   - Screenshots (minimum 2)

2. **Create signed app bundle**:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

3. **Upload to Google Play Console**:
   - Go to [play.google.com/console](https://play.google.com/console)
   - Create a new app
   - Complete store listing
   - Upload app bundle
   - Submit for review

4. **One-time registration fee**: $25

## Updating the App

1. Update web code
2. Increment `versionCode` in `build.gradle`
3. Build and sync:
   ```bash
   npm run build
   npx cap sync android
   ```
4. Rebuild APK in Android Studio

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
