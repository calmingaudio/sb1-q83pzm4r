# SkyCalm - Flying Anxiety App

A React Native app built with Expo to help users manage flying anxiety through breathing exercises, meditation, and educational content.

## Environment Variables

This app uses Firebase for authentication and data storage. The Firebase configuration is stored in environment variables to keep sensitive API keys secure.

### Setting up Environment Variables

1. Create a `.env` file in the root directory of the project
2. Add the following variables with your Firebase project values:

```env
# Firebase Configuration (must start with EXPO_PUBLIC_ for client-side access)
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

**Important**: Environment variables in Expo must be prefixed with `EXPO_PUBLIC_` to be accessible in the client-side code. Variables without this prefix are only available on the server side.

### Current Configuration

The app is currently configured with the following Firebase project:
- Project ID: `skycalm-a8562`
- Bundle ID: `com.skycalm.app`

## Development

```bash
npm install
npm run dev
```

## Building

```bash
# For iOS
npm run ios

# For Android
npm run android
```