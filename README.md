## How to set up and run the app
1. Install dependencies
From the project root:
cd /Users/arlene-mac/my-app
npm install

3. Start the app
npm start

or directly:
npx expo start

You can also launch a platform-specific runner:
npm run android
npm run ios
npm run web

## Required tools
Node.js (a current LTS version works well)
npm
Expo tooling via npx expo (no global install required)

## What this app uses
Expo + Expo Router
react-native
expo-camera, expo-av, expo-crypto, expo-secure-store, and other Expo libraries

Local storage:
AsyncStorage for app data
SecureStore for storing hashed credentials
