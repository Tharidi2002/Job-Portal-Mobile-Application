const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Fixing lightningcss for the build environment...");

// Try multiple approaches to resolve the lightningcss issue
async function fixLightningCSS() {
  try {
    // First approach: Reinstall nativewind with specific config
    console.log("Reinstalling nativewind and related packages...");
    execSync("npm uninstall nativewind react-native-css-interop", {
      stdio: "inherit",
    });
    execSync("npm install nativewind@latest --platform=linux --arch=x64", {
      stdio: "inherit",
    });

    // Second approach: Directly rebuild lightningcss
    console.log("Rebuilding lightningcss for Linux...");
    execSync("npm rebuild lightningcss --platform=linux --arch=x64", {
      stdio: "inherit",
    });

    // Third approach: Install specific version known to work
    console.log("Installing specific lightningcss version...");
    execSync(
      "npm install lightningcss@1.18.0 --platform=linux --arch=x64 --force",
      {
        stdio: "inherit",
      }
    );

    // Fourth approach: Check if we can find the binary and fix paths
    const cssInteropPath = path.resolve(
      process.cwd(),
      "node_modules/react-native-css-interop/node_modules/lightningcss"
    );

    if (fs.existsSync(cssInteropPath)) {
      console.log(
        "Found lightningcss in react-native-css-interop, checking binaries..."
      );

      const nodeFolder = path.join(cssInteropPath, "node");
      if (fs.existsSync(nodeFolder)) {
        // List all available binaries
        const files = fs.readdirSync(nodeFolder);
        console.log("Available binaries:", files);

        // Look for Linux binary variants
        const linuxBinaries = files.filter((f) => f.includes("linux"));
        if (linuxBinaries.length > 0) {
          console.log("Found Linux binaries:", linuxBinaries);

          // Create symlink to the required file if needed
          if (
            !linuxBinaries.includes("lightningcss.linux-x64-gnu.node") &&
            linuxBinaries.length > 0
          ) {
            const sourceBinary = linuxBinaries[0];
            const targetPath = path.join(
              nodeFolder,
              "lightningcss.linux-x64-gnu.node"
            );
            console.log(
              `Creating symlink from ${sourceBinary} to ${targetPath}`
            );
            fs.copyFileSync(path.join(nodeFolder, sourceBinary), targetPath);
          }
        }
      }
    }

    console.log("lightningcss fix completed successfully");
  } catch (error) {
    console.error("Error fixing lightningcss:", error.message);
    process.exit(1);
  }
}

fixLightningCSS();
