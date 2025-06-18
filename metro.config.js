// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// -----------------------------------------------------------------------------
// Disable the new, stricter "package.json exports" resolution until every
// library in the ecosystem has been updated to support it.
// This is a temporary workaround for Firebase Auth compatibility with Expo SDK 53
// -----------------------------------------------------------------------------
config.resolver.unstable_enablePackageExports = false;

module.exports = config;