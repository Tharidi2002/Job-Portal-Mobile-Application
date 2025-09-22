const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔧 Running prepare-build script to fix lightningcss...");

function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { encoding: "utf8" });
    console.log(output);
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

// First attempt: reinstall lightningcss with specific version
console.log("Attempting to reinstall lightningcss...");
runCommand("npm install lightningcss@1.22.0 --no-save");

// Check if we're on Linux (EAS build)
const isLinux = process.platform === "linux";
if (isLinux) {
  console.log("Running on Linux, attempting to fix binary issues...");

  // Find the path to the lightningcss module in react-native-css-interop
  const nodeModulesPath = path.resolve(process.cwd(), "node_modules");
  const cssInteropPath = path.join(
    nodeModulesPath,
    "react-native-css-interop",
    "node_modules",
    "lightningcss"
  );
  const directLightningCssPath = path.join(nodeModulesPath, "lightningcss");

  if (fs.existsSync(cssInteropPath)) {
    console.log("Found lightningcss in react-native-css-interop");

    // Create bindings folder if it doesn't exist
    const binariesFolder = path.join(cssInteropPath, "node");
    if (!fs.existsSync(binariesFolder)) {
      fs.mkdirSync(binariesFolder, { recursive: true });
      console.log("Created node folder in lightningcss module");
    }

    // Install linux-specific binaries
    console.log("Installing lightningcss with linux binaries...");
    runCommand(
      "npm install lightningcss@1.22.0 --platform=linux --arch=x64 --no-save"
    );

    // Try to copy binaries if they exist in the direct lightningcss install
    if (fs.existsSync(directLightningCssPath)) {
      const linuxBinary = path.join(
        directLightningCssPath,
        "node",
        "lightningcss.linux-x64-gnu.node"
      );
      if (fs.existsSync(linuxBinary)) {
        console.log(
          "Found Linux binary, copying to react-native-css-interop module..."
        );
        const targetBinary = path.join(
          cssInteropPath,
          "node",
          "lightningcss.linux-x64-gnu.node"
        );
        fs.copyFileSync(linuxBinary, targetBinary);
        console.log("Successfully copied Linux binary");
      } else {
        console.log("Linux binary not found in direct install");
      }
    }
  }

  // Patch the metro config to handle missing lightningcss more gracefully
  const metroConfigPath = path.join(process.cwd(), "metro.config.js");
  if (fs.existsSync(metroConfigPath)) {
    console.log("Patching metro.config.js to handle missing lightningcss...");

    let metroConfig = fs.readFileSync(metroConfigPath, "utf8");

    // Add try-catch around the nativewind import
    if (
      !metroConfig.includes("try {") &&
      metroConfig.includes("nativewind/metro")
    ) {
      metroConfig = metroConfig.replace(
        /const\s+{[^}]*}\s*=\s*require\(['"]nativewind\/metro['"]\)/,
        `let nativewindTransformer = () => ({});
try {
  const nativewind = require('nativewind/metro');
  nativewindTransformer = nativewind.withNativeWind;
} catch (error) {
  console.warn('Error loading nativewind/metro:', error.message);
  console.warn('Continuing without NativeWind styling...');
}`
      );

      // Replace references to withNativeWind with our safe version
      metroConfig = metroConfig.replace(
        /withNativeWind\(/g,
        "nativewindTransformer("
      );

      fs.writeFileSync(metroConfigPath, metroConfig);
      console.log("Successfully patched metro.config.js");
    }
  }
}

// Additional fallback: create a global override in package.json for lightningcss
const packageJsonPath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packageJsonPath)) {
  console.log("Adding overrides for lightningcss in package.json...");

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Add resolutions/overrides for lightningcss
  packageJson.overrides = packageJson.overrides || {};
  packageJson.overrides["lightningcss"] = "1.22.0";

  // Add resolutions for yarn users
  packageJson.resolutions = packageJson.resolutions || {};
  packageJson.resolutions["lightningcss"] = "1.22.0";

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("Updated package.json with overrides");

  // Run npm install again to apply overrides
  console.log("Running npm install to apply overrides...");
  runCommand("npm install");
}

console.log("🎉 prepare-build script completed!");
