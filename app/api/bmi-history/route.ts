import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/client";
import { bmiRecords, users } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi >= 18.5 && bmi <= 24.9) return "Normal";
  if (bmi >= 25 && bmi <= 29.9) return "Overweight";
  return "Obese";
};

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get user from database by email
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email!))
      .limit(1);

    if (dbUser.length === 0) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Fetch BMI records for this user
    const records = await db
      .select()
      .from(bmiRecords)
      .where(eq(bmiRecords.userId, dbUser[0].id))
      .orderBy(desc(bmiRecords.recordedAt));

    // Add category information to each record
    const recordsWithCategory = records.map((record) => ({
      id: record.id,
      weight: record.weight,
      height: record.height,
      bmiValue: record.bmiValue,
      recordedAt: record.recordedAt,
      category: getBMICategory(Number(record.bmiValue)),
    }));

    return NextResponse.json({ data: recordsWithCategory });
  } catch (error) {
    console.error("Error fetching BMI history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Parse request body
    const { weight, height, bmiValue } = await request.json();

    if (!weight || !height || !bmiValue) {
      return NextResponse.json(
        { error: "Missing required fields: weight, height, bmiValue" },
        { status: 400 }
      );
    }

    // Get user from database by email
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email!))
      .limit(1);

    if (dbUser.length === 0) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Save to database table
    const [newRecord] = await db
      .insert(bmiRecords)
      .values({
        userId: dbUser[0].id,
        weight: Number(weight).toFixed(2),
        height: Number(height).toFixed(2),
        bmiValue: Number(bmiValue).toFixed(2),
        recordedAt: new Date(),
      })
      .returning();

    // Get current user metadata
    const currentMetadata = user.user_metadata || {};

    // Create BMI record for metadata
    const bmiRecord = {
      bmi: Number(bmiValue),
      category: getBMICategory(Number(bmiValue)),
      weight: Number(weight),
      height: Number(height),
      date: new Date().toISOString(),
    };

    // Update user metadata with single BMI record
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...currentMetadata,
        bmi_record: bmiRecord,
      },
    });

    if (updateError) {
      console.error("Error updating user metadata:", updateError);
      // Don't fail the request if metadata update fails
    }

    return NextResponse.json({
      data: {
        ...newRecord,
        category: bmiRecord.category,
      },
    });
  } catch (error) {
    console.error("Error saving BMI record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Parse request body to get record ID
    const { recordId } = await request.json();

    if (!recordId) {
      return NextResponse.json(
        { error: "Missing required field: recordId" },
        { status: 400 }
      );
    }

    // Get user from database by email
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email!))
      .limit(1);

    if (dbUser.length === 0) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Delete the BMI record (only if it belongs to the current user)
    const result = await db
      .delete(bmiRecords)
      .where(
        and(eq(bmiRecords.id, recordId), eq(bmiRecords.userId, dbUser[0].id))
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        {
          error:
            "BMI record not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "BMI record deleted successfully",
      deletedRecord: result[0],
    });
  } catch (error) {
    console.error("Error deleting BMI record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
