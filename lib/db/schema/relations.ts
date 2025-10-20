import { relations } from "drizzle-orm";
import { users, bmiRecords, pageVisits } from "./tables";

export const usersRelations = relations(users, ({ many }) => ({
  bmiRecords: many(bmiRecords),
  pageVisits: many(pageVisits),
}));

export const bmiRecordsRelations = relations(bmiRecords, ({ one }) => ({
  user: one(users, {
    fields: [bmiRecords.userId],
    references: [users.id],
  }),
}));

export const pageVisitsRelations = relations(pageVisits, ({ one }) => ({
  user: one(users, {
    fields: [pageVisits.userId],
    references: [users.id],
  }),
}));
