import { relations } from "drizzle-orm";
import { users, bmiRecords } from "./tables";

export const usersRelations = relations(users, ({ many }) => ({
  bmiRecords: many(bmiRecords),
}));

export const bmiRecordsRelations = relations(bmiRecords, ({ one }) => ({
  user: one(users, {
    fields: [bmiRecords.userId],
    references: [users.id],
  }),
}));
