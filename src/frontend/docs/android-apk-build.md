# Android APK Build Guide

This guide explains how to build an Android APK for the College Planner app using Capacitor.

## Prerequisites

Before building the Android APK, ensure you have the following installed:

1. **Node.js and npm/pnpm** - Already required for the frontend build
2. **Android Studio** - Download from [developer.android.com/studio](https://developer.android.com/studio)
3. **Java Development Kit (JDK)** - JDK 17 or later (usually bundled with Android Studio)
4. **Capacitor CLI** - Install globally: `npm install -g @capacitor/cli`

### Android Studio Setup

1. Install Android Studio
2. Open Android Studio and go to **Settings/Preferences → Appearance & Behavior → System Settings → Android SDK**
3. Install the following:
   - Android SDK Platform (API 33 or later recommended)
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android SDK Command-line Tools
4. Set the `ANDROID_HOME` environment variable:
   - **macOS/Linux**: Add to `~/.bashrc` or `~/.zshrc`:
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     export PATH=$PATH:$ANDROID_HOME/tools
     ```
   - **Windows**: Add to System Environment Variables:
     ```
     ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
     ```

## Initial Setup

### 1. Install Capacitor Dependencies

From the `frontend` directory:

