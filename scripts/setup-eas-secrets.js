#!/usr/bin/env node

// Script to set up EAS secrets for Firebase configuration
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up EAS secrets for Firebase configuration...\n');

// Read .env file
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please create one with your Firebase configuration.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse .env file
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

// Firebase environment variables
const firebaseVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID'
];

console.log('📋 Firebase Environment Variables:');
firebaseVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing`);
  }
});

console.log('\n🚀 To set up EAS secrets, run the following commands:');
console.log('(Make sure you have EAS CLI installed and are logged in)\n');

firebaseVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    console.log(`eas secret:create --scope project --name ${varName} --value "${value}"`);
  }
});

console.log('\n💡 Alternative: You can also add these to your eas.json file:');
console.log('Add an "env" section to each build profile:');
console.log(`
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_FIREBASE_API_KEY": "${envVars['EXPO_PUBLIC_FIREBASE_API_KEY'] || 'your_api_key'}",
        "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN": "${envVars['EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'] || 'your_auth_domain'}",
        "EXPO_PUBLIC_FIREBASE_PROJECT_ID": "${envVars['EXPO_PUBLIC_FIREBASE_PROJECT_ID'] || 'your_project_id'}",
        "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET": "${envVars['EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'] || 'your_storage_bucket'}",
        "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "${envVars['EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'] || 'your_sender_id'}",
        "EXPO_PUBLIC_FIREBASE_APP_ID": "${envVars['EXPO_PUBLIC_FIREBASE_APP_ID'] || 'your_app_id'}"
      }
    }
  }
}
`);

console.log('\n🔒 Security Note:');
console.log('- Using EAS secrets is more secure than hardcoding values in eas.json');
console.log('- Secrets are encrypted and not visible in your code repository');
console.log('- You can manage secrets using: eas secret:list, eas secret:delete, etc.'); 