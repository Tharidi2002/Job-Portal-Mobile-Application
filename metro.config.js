const { getDefaultConfig } = require("expo/metro-config");

// Get the default Expo config
const config = getDefaultConfig(__dirname);

// Only use NativeWind in development, not during EAS build
const isEASBuild = process.env.EAS_BUILD === "true";

// Export different configs for development vs EAS build
if (isEASBuild) {
  console.log(
    "Running in EAS Build environment - using standard Metro config without NativeWind"
  );
  module.exports = config;
} else {
  try {
    // Try to use NativeWind in development
    const { withNativeWind } = require("nativewind/metro");
    module.exports = withNativeWind(config, { input: "./global.css" });
    console.log("Using NativeWind transformer for Metro");
  } catch (error) {
    console.warn("Failed to initialize NativeWind:", error.message);
    console.warn("Falling back to standard Metro config");
    module.exports = config;
  }
}
