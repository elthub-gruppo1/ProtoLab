import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const prototypes = pgTable("prototypes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  area: text("area").notNull(),
  owner: text("owner").notNull(),
  targetDate: text("target_date").notNull(),
  status: text("status").notNull().default("DESIGN"),
});

export const testCases = pgTable("test_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prototypeId: varchar("prototype_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  result: text("result").notNull().default("NOT_RUN"),
});

export const insertPrototypeSchema = createInsertSchema(prototypes).omit({ id: true, status: true }).extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  owner: z.string().min(2, "Owner must be at least 2 characters"),
  area: z.enum(["Space", "Automotive", "Industrial", "Other"]),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
});

export const insertTestCaseSchema = createInsertSchema(testCases).omit({ id: true, result: true }).extend({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["FUNCTIONAL", "ENVIRONMENTAL", "INTEGRATION"]),
  prototypeId: z.string().min(1),
});

export const updateTestResultSchema = z.object({
  result: z.enum(["NOT_RUN", "PASS", "FAIL"]),
});

export type InsertPrototype = z.infer<typeof insertPrototypeSchema>;
export type Prototype = typeof prototypes.$inferSelect;
export type InsertTestCase = z.infer<typeof insertTestCaseSchema>;
export type TestCase = typeof testCases.$inferSelect;

export const AREAS = ["Space", "Automotive", "Industrial", "Other"] as const;
export const TEST_TYPES = ["FUNCTIONAL", "ENVIRONMENTAL", "INTEGRATION"] as const;
export const TEST_RESULTS = ["NOT_RUN", "PASS", "FAIL"] as const;
export const STATUSES = ["DESIGN", "BUILD", "TEST", "READY"] as const;
export type PrototypeStatus = typeof STATUSES[number];
export type TestResult = typeof TEST_RESULTS[number];

export interface GateCheckResult {
  allowed: boolean;
  reasons: string[];
}

export interface PrototypeWithTests extends Prototype {
  tests: TestCase[];
  readiness: number;
}
