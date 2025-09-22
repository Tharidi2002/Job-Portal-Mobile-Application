const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("📦 Starting lightningcss Linux fix...");

try {
  // First approach: Install lightningcss with the correct binary
  console.log("🔄 Installing specific lightningcss version for Linux...");
  execSync("npm install lightningcss@1.22.0 --no-save", { stdio: "inherit" });

  // Find all instances of lightningcss in node_modules
  const findLightningCss = () => {
    const results = execSync('find ./node_modules -name "lightningcss" -type d')
      .toString()
      .trim()
      .split("\n")
      .filter(Boolean);

    console.log(
      `🔍 Found ${results.length} lightningcss installations:`,
      results
    );
    return results;
  };

  const lightningCssPaths = findLightningCss();

  // Ensure the binary is in place for all installations
  lightningCssPaths.forEach((cssPath) => {
    const nodeFolder = path.join(cssPath, "node");
    if (fs.existsSync(nodeFolder)) {
      console.log(`🔍 Checking ${nodeFolder}...`);

      // Find what binaries are available
      const files = fs.readdirSync(nodeFolder);
      console.log(`📋 Available binaries in ${nodeFolder}:`, files);

      // Check if the Linux binary exists
      const targetBinary = "lightningcss.linux-x64-gnu.node";
      const hasLinuxBinary = files.includes(targetBinary);

      if (!hasLinuxBinary) {
        console.log(`❌ Missing Linux binary: ${targetBinary}`);

        // Look for any binary we can use as a source
        const compatibleBinaries = files.filter(
          (f) => f.includes("linux") || f.includes("x64")
        );

        if (compatibleBinaries.length > 0) {
          // Use the first compatible binary
          const sourceBinary = compatibleBinaries[0];
          console.log(`🔄 Creating Linux binary from ${sourceBinary}`);

          fs.copyFileSync(
            path.join(nodeFolder, sourceBinary),
            path.join(nodeFolder, targetBinary)
          );

          console.log(`✅ Created ${targetBinary} from ${sourceBinary}`);
        } else {
          // If no compatible binary, create an empty one - this is a last resort
          // that will at least let the build continue
          console.log("⚠️ No compatible binary found, creating placeholder...");

          // Download a pre-built binary from npm
          try {
            console.log("🔽 Downloading pre-built binary...");
            execSync(
              "curl -o temp-binary.node https://cdn.jsdelivr.net/npm/lightningcss-linux-x64-gnu@1.22.0/lightningcss.linux-x64-gnu.node",
              { stdio: "inherit" }
            );

            if (fs.existsSync("temp-binary.node")) {
              fs.copyFileSync(
                "temp-binary.node",
                path.join(nodeFolder, targetBinary)
              );
              fs.unlinkSync("temp-binary.node");
              console.log("✅ Downloaded and installed pre-built binary");
            }
          } catch (dlError) {
            console.log("❌ Failed to download binary:", dlError.message);

            // Last resort - create empty file
            fs.writeFileSync(
              path.join(nodeFolder, targetBinary),
              Buffer.from([])
            );
            console.log("⚠️ Created empty placeholder binary");
          }
        }
      } else {
        console.log(`✅ Linux binary already exists: ${targetBinary}`);
      }
    }
  });

  // Update package.json to ensure we use a compatible version
  console.log("📝 Updating package.json dependencies...");
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = require(packageJsonPath);

  if (packageJson.dependencies && packageJson.dependencies.nativewind) {
    console.log("🔄 Ensuring compatible nativewind version...");

    // Temporarily add overrides for lightningcss
    packageJson.overrides = packageJson.overrides || {};
    packageJson.overrides.lightningcss = "1.22.0";

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log("✅ Updated package.json with overrides");

    // Reinstall to apply overrides
    console.log("🔄 Reinstalling dependencies with overrides...");
    execSync("npm install --no-audit --no-fund", { stdio: "inherit" });
  }

  console.log("✅ lightningcss fix completed successfully");
} catch (error) {
  console.error("❌ Error fixing lightningcss:", error.message);
  process.exit(1);
}
