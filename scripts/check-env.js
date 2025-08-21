#!/usr/bin/env node

// Script to check if Firebase environment variables are set
const fs = require('fs');
const path = require('path');

// Check for .env file
const envPath = path.join(__dirname, '..', '.env');
const envLocalPath = path.join(__dirname, '..', '.env.local');

console.log('🔍 Checking Firebase environment variables...\n');

// Check if .env files exist
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
} else {
  console.log('❌ .env file not found');
}

if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local file found');
} else {
  console.log('❌ .env.local file not found');
}

// Check environment variables
const requiredVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID'
];

console.log('\n📋 Environment Variables Status:');
let allSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    allSet = false;
  }
});

console.log('\n📝 Summary:');
if (allSet) {
  console.log('✅ All Firebase environment variables are set!');
} else {
  console.log('❌ Some Firebase environment variables are missing.');
  console.log('\n💡 To fix this:');
  console.log('1. Create a .env file in your project root');
  console.log('2. Add your Firebase configuration:');
  console.log(`
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
  `);
  console.log('3. Restart your development server');
}

console.log('\n🔧 For TestFlight builds:');
console.log('Make sure your EAS build has access to these environment variables.');
console.log('You can set them in your EAS project settings or use EAS secrets.'); 