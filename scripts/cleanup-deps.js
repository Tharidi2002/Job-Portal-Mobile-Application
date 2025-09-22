/**
 * This script helps clean up the project's dependencies before building
 * Run this with: node scripts/cleanup-deps.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Starting dependency cleanup process...");

// Delete package-lock.json and node_modules
const filesToDelete = ["package-lock.json", "yarn.lock", "node_modules"];

filesToDelete.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);

  if (fs.existsSync(filePath)) {
    console.log(`Removing ${file}...`);

    if (file === "node_modules") {
      try {
        // Use rimraf for node_modules because it can be large
        execSync("npx rimraf node_modules");
        console.log("Successfully deleted node_modules");
      } catch (error) {
        console.error(`Error deleting node_modules: ${error.message}`);
      }
    } else {
      // Delete regular files
      try {
        fs.unlinkSync(filePath);
        console.log(`Successfully deleted ${file}`);
      } catch (error) {
        console.error(`Error deleting ${file}: ${error.message}`);
      }
    }
  } else {
    console.log(`${file} not found, skipping...`);
  }
});

// Create .npmrc file if it doesn't exist
const npmrcPath = path.join(__dirname, "..", ".npmrc");
const npmrcContent = `engine-strict=false`;

try {
  fs.writeFileSync(npmrcPath, npmrcContent);
  console.log("Created/updated .npmrc file with proper settings");
} catch (error) {
  console.error(`Error creating .npmrc file: ${error.message}`);
}

console.log("\nDependency cleanup complete!");
console.log("\nNext steps:");
console.log("1. Run: npm install");
console.log("2. Run: eas build --platform android --profile production");
console.log("\nHappy building! 🚀");
