import { relations } from "drizzle-orm";
import { users, bmiRecords, qrScans } from "./tables";

export const usersRelations = relations(users, ({ many }) => ({
  bmiRecords: many(bmiRecords),
  qrScans: many(qrScans),
}));

export const bmiRecordsRelations = relations(bmiRecords, ({ one }) => ({
  user: one(users, {
    fields: [bmiRecords.userId],
    references: [users.id],
  }),
}));

export const qrScansRelations = relations(qrScans, ({ one }) => ({
  user: one(users, {
    fields: [qrScans.userId],
    references: [users.id],
  }),
}));
