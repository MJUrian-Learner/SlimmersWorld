const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, "..", "public", "qr-codes");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const exerciseData = [
  {
    id: "dumbbell-lateral-raises",
    name: "Lateral Raises",
    path: "/exercises/dumbbells/lateral-raises",
  },
  {
    id: "dumbbell-bicep-curl",
    name: "Bicep Curl",
    path: "/exercises/dumbbells/bicep-curl",
  },
  {
    id: "dumbbell-tricep-extension",
    name: "Tricep Extension",
    path: "/exercises/dumbbells/tricep-extension",
  },
  {
    id: "dumbbell-wrist-curl",
    name: "Wrist Curl",
    path: "/exercises/dumbbells/wrist-curl",
  },
  {
    id: "kettlebell-swing",
    name: "Kettlebell Swing",
    path: "/exercises/kettlebell/swing",
  },
  {
    id: "kettlebell-squats",
    name: "Kettlebell Squats",
    path: "/exercises/kettlebell/squats",
  },
  {
    id: "ab-roller-wheel-basic-rollout",
    name: "Basic Rollout",
    path: "/exercises/ab-roller-wheel/basic-rollout",
  },
  {
    id: "ab-roller-wheel-standing-rollout",
    name: "Standing Rollout",
    path: "/exercises/ab-roller-wheel/standing-rollout",
  },
  {
    id: "ab-roller-wheel-oblique-rollout",
    name: "Oblique Rollout",
    path: "/exercises/ab-roller-wheel/oblique-rollout",
  },
];

async function generateQRCodes() {
  console.log("🚀 Generating QR codes for exercise...");

  for (const exercise of exerciseData) {
    try {
      // Generate QR code as PNG
      const qrCodePath = path.join(outputDir, `${exercise.id}-qr.png`);
      await QRCode.toFile(qrCodePath, exercise.path, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      console.log(`✅ Generated QR code for ${exercise.name}: ${qrCodePath}`);
    } catch (error) {
      console.error(`❌ Error generating QR code for ${exercise.name}:`, error);
    }
  }

  console.log("\n🎉 All QR codes generated successfully!");
  console.log(`📁 Files saved in: ${outputDir}`);
  console.log("\n📋 Next steps:");
  console.log("1. Print the QR code images from /public/qr-codes/");
  console.log("2. Place them on the corresponding exercise");
  console.log("3. Users can scan them to access exercise information");
}

generateQRCodes().catch(console.error);
