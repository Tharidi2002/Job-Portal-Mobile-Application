const fs = require("fs");
const path = require("path");

// This script applies a patch to metro.config.js to make it more resilient
// against lightningcss issues in the EAS build environment

console.log("📝 Applying metro config patch...");

try {
  const metroConfigPath = path.join(process.cwd(), "metro.config.js");
  let metroConfig = fs.readFileSync(metroConfigPath, "utf8");

  // Backup the original file first
  fs.writeFileSync(
    path.join(process.cwd(), "metro.config.original.js"),
    metroConfig
  );
  console.log("✅ Created backup of metro.config.js");

  // Modify the metro config to add error handling around NativeWind
  const patchedConfig = `const { getDefaultConfig } = require("expo/metro-config")
const config = getDefaultConfig(__dirname)

// Try to use NativeWind but fallback gracefully if it fails
let finalConfig = config;
try {
  const { withNativeWind } = require("nativewind/metro")
  finalConfig = withNativeWind(config, { input: "./global.css" })
  console.log('✅ NativeWind configured successfully')
} catch (error) {
  console.warn('⚠️ Failed to configure NativeWind:', error.message)
  console.warn('⚠️ Building without NativeWind styling')
}

module.exports = finalConfig
`;

  fs.writeFileSync(metroConfigPath, patchedConfig);
  console.log("✅ Applied resilient patch to metro.config.js");
} catch (error) {
  console.error("❌ Error patching metro config:", error.message);
}
