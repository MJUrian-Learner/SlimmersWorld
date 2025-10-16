import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import * as schema from "@/lib/db/schema";
import { users, bmiRecords } from "@/lib/db/schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { config } from "dotenv";

// Load environment variables
config({ path: [".env.local", ".env.development"] });

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

// Helper function to calculate BMI
function calculateBMI(weight: number, height: number): number {
  return Number((weight / Math.pow(height / 100, 2)).toFixed(2));
}

// Helper function to get BMI category
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// Helper function to generate random BMI data
function generateBMIData() {
  const weight = Number((Math.random() * (90 - 50) + 50).toFixed(2)); // 50-90 kg
  const height = Number((Math.random() * (190 - 150) + 150).toFixed(2)); // 150-190 cm
  const bmiValue = calculateBMI(weight, height);

  return {
    weight,
    height,
    bmiValue,
    category: getBMICategory(bmiValue),
  };
}

async function seedData() {
  console.log("🌱 Starting seed process...");

  const admin = createAdminClient();

  const seedUsers = [];

  // Step 1: Create Supabase users and collect their data
  console.log("👤 Creating Supabase users...");

  for (let i = 1; i <= 5; i++) {
    const email = `pimentelflorie+${i.toString().padStart(2, "0")}@gmail.com`;
    const password = "Test123!";
    const firstName = `User${i}`;
    const lastName = "Test";

    try {
      // Create user in Supabase
      const { data: supabaseUser, error: createError } = await admin.createUser(
        {
          email,
          password,
          user_metadata: {
            firstName,
            lastName,
          },
          email_confirm: true, // Auto-confirm email
        }
      );

      if (createError) {
        console.error(`Error creating Supabase user ${email}:`, createError);
        continue;
      }

      console.log(`✅ Created Supabase user: ${email}`);

      seedUsers.push({
        supabaseId: supabaseUser.user.id,
        email,
        name: `${firstName} ${lastName}`,
      });
    } catch (error) {
      console.error(`Error creating user ${email}:`, error);
    }
  }

  // Step 2: Create users in PostgreSQL database
  console.log("🗄️ Creating database users...");

  const dbUsers = [];
  for (const userData of seedUsers) {
    try {
      const [dbUser] = await db
        .insert(users)
        .values({
          email: userData.email,
          name: userData.name,
        })
        .returning();

      dbUsers.push({
        ...userData,
        dbId: dbUser.id,
      });

      console.log(`✅ Created database user: ${userData.email}`);
    } catch (error) {
      console.error(`Error creating database user ${userData.email}:`, error);
    }
  }

  // Step 3: Create BMI history records for each user
  console.log("📊 Creating BMI history records...");

  for (const user of dbUsers) {
    try {
      const bmiHistoryRecords = [];

      // Create 3-7 historical BMI records for each user
      const recordCount = Math.floor(Math.random() * 5) + 3; // 3-7 records

      for (let j = 0; j < recordCount; j++) {
        const bmiData = generateBMIData();

        // Create records with dates spread over the last 6 months
        const daysAgo = Math.floor(Math.random() * 180); // Random day in last 6 months
        const recordedAt = new Date();
        recordedAt.setDate(recordedAt.getDate() - daysAgo);

        const bmiRecord = await db
          .insert(bmiRecords)
          .values({
            userId: user.dbId,
            weight: bmiData.weight.toString(),
            height: bmiData.height.toString(),
            bmiValue: bmiData.bmiValue.toString(),
            recordedAt,
          })
          .returning();

        bmiHistoryRecords.push({
          ...bmiRecord[0],
          category: bmiData.category,
          recordedAt,
        });
      }

      // Sort by date to get the latest record
      bmiHistoryRecords.sort(
        (a, b) => b.recordedAt.getTime() - a.recordedAt.getTime()
      );
      const latestRecord = bmiHistoryRecords[0];

      console.log(`✅ Created ${recordCount} BMI records for ${user.email}`);

      // Step 4: Update Supabase user metadata with latest BMI record
      const bmiMetadata = {
        bmi: Number(latestRecord.bmiValue),
        category: latestRecord.category,
        weight: Number(latestRecord.weight),
        height: Number(latestRecord.height),
        date: latestRecord.recordedAt.toISOString(),
      };

      const { error: updateError } = await admin.updateUserById(
        user.supabaseId,
        {
          user_metadata: {
            firstName: user.name.split(" ")[0],
            lastName: user.name.split(" ").slice(1).join(" "),
            bmi_record: bmiMetadata,
          },
        }
      );

      if (updateError) {
        console.error(
          `Error updating metadata for ${user.email}:`,
          updateError
        );
      } else {
        console.log(
          `✅ Updated metadata for ${user.email} with latest BMI: ${bmiMetadata.bmi} (${bmiMetadata.category})`
        );
      }
    } catch (error) {
      console.error(`Error creating BMI records for ${user.email}:`, error);
    }
  }

  console.log("🎉 Seed process completed successfully!");
  console.log(`📈 Summary:`);
  console.log(`   - Created ${dbUsers.length} users`);
  console.log(`   - Created BMI history records for each user`);
  console.log(`   - Updated user metadata with latest BMI records`);
  console.log(
    `   - Test login credentials: email as listed above, password: Test123!`
  );
}

// Run the seed function
seedData()
  .then(() => {
    console.log("✨ Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
