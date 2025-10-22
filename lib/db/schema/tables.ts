import {
  pgTable,
  varchar,
  decimal,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const bmiRecords = pgTable("bmi_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(), // in kg
  height: decimal("height", { precision: 5, scale: 2 }).notNull(), // in cm
  bmiValue: decimal("bmi_value", { precision: 4, scale: 2 }).notNull(),
  recordedAt: timestamp("recorded_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// QR Code Scans tracking
export const qrScans = pgTable("qr_scans", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  exercisePath: varchar("exercise_path", { length: 500 }).notNull(), // e.g., "/exercises/dumbbells/bicep-curl"
  exerciseName: varchar("exercise_name", { length: 255 }), // e.g., "Bicep Curl"
  equipmentType: varchar("equipment_type", { length: 100 }), // e.g., "Dumbbells", "Kettlebell", "Ab Roller"
  sessionId: varchar("session_id", { length: 255 }).notNull(), // For tracking unique users
  userAgent: varchar("user_agent", { length: 500 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  scannedAt: timestamp("scanned_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
