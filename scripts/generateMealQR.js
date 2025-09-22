/**
 * This script generates a QR code for meal data testing
 * To use:
 * 1. Run with: node scripts/generateMealQR.js
 * 2. Open the generated QR code image or URL in a browser
 * 3. Scan using the app's QR scanner
 */

const MEAL_DATA = {
  type: "recipe",
  meal: {
    title: "Avocado Toast",
    name: "Avocado Toast with Egg",
    description:
      "Delicious and nutritious breakfast option with mashed avocado, poached egg, and whole grain toast.",
    mealType: "breakfast",
    ingredients: [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "2 eggs",
      "1 tbsp olive oil",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)",
      "Fresh herbs (optional)",
    ],
    cookingTime: 15,
    servings: 2,
    calories: 350,
    favorite: false,
  },
};

// Convert the meal data to a JSON string
const qrData = JSON.stringify(MEAL_DATA);

// Generate a URL that will display the QR code
const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
  qrData
)}`;

console.log("\n==========================================");
console.log("Meal QR Code Generator");
console.log("==========================================\n");
console.log("QR Code contains the following meal data:");
console.log(JSON.stringify(MEAL_DATA, null, 2));
console.log("\n==========================================");
console.log("To view/save the QR code, open this URL in your browser:");
console.log(qrCodeUrl);
console.log("\n==========================================");
console.log("Instructions:");
console.log("1. Open the URL above in a browser");
console.log("2. Scan the displayed QR code with the Meal Mate app");
console.log("3. Confirm adding the recipe to your meals");
console.log("==========================================\n");

// Alternative method - if you have qrcode package installed
try {
  const qrcode = require("qrcode");
  console.log("Generating QR code image...");

  // Save QR code as image file
  qrcode.toFile(
    "./mealQRCode.png",
    qrData,
    {
      color: {
        dark: "#000",
        light: "#FFF",
      },
    },
    function (err) {
      if (err) {
        console.log(
          "Could not generate local QR code image. Use the URL above instead."
        );
      } else {
        console.log(
          "QR code image saved as mealQRCode.png in the project root directory"
        );
      }
    }
  );
} catch (e) {
  console.log(
    "QR code package not installed. Use the URL above to generate the QR code."
  );
  console.log("To install the qrcode package: npm install qrcode");
}
