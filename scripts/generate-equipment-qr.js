const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'public', 'qr-codes');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const equipmentData = [
  {
    id: "dumbbell",
    name: "Dumbbell Station",
    url: "/equipment/dumbbell"
  },
  {
    id: "kettlebell", 
    name: "Kettlebell Station",
    url: "/equipment/kettlebell"
  },
  {
    id: "ab-roller",
    name: "Ab Roller Station",
    url: "/equipment/ab-roller"
  }
];

async function generateQRCodes() {
  console.log('🚀 Generating QR codes for equipment...');
  
  for (const equipment of equipmentData) {
    try {
      // For localhost development
      const localhostUrl = `http://localhost:3000${equipment.url}`;
      
      // Generate QR code as PNG
      const qrCodePath = path.join(outputDir, `${equipment.id}-qr.png`);
      await QRCode.toFile(qrCodePath, localhostUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      console.log(`✅ Generated QR code for ${equipment.name}: ${qrCodePath}`);
      console.log(`   URL: ${localhostUrl}`);
      
    } catch (error) {
      console.error(`❌ Error generating QR code for ${equipment.name}:`, error);
    }
  }
  
  console.log('\n🎉 All QR codes generated successfully!');
  console.log(`📁 Files saved in: ${outputDir}`);
  console.log('\n📋 Next steps:');
  console.log('1. Print the QR code images from /public/qr-codes/');
  console.log('2. Place them on the corresponding equipment');
  console.log('3. Users can scan them to access exercise information');
}

generateQRCodes().catch(console.error);

