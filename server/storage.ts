import {
  type Prototype,
  type InsertPrototype,
  type TestCase,
  type InsertTestCase,
  type PrototypeWithTests,
  type GateCheckResult,
  prototypes,
  testCases,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPrototypes(): Promise<PrototypeWithTests[]>;
  getPrototype(id: string): Promise<PrototypeWithTests | undefined>;
  createPrototype(data: InsertPrototype): Promise<Prototype>;
  updatePrototype(id: string, data: Partial<InsertPrototype>): Promise<Prototype | undefined>;
  updatePrototypeStatus(id: string, status: string): Promise<Prototype | undefined>;
  deletePrototype(id: string): Promise<void>;
  createTestCase(data: InsertTestCase): Promise<TestCase>;
  updateTestResult(id: string, result: string): Promise<TestCase | undefined>;
  deleteTestCase(id: string): Promise<void>;
}

function calculateReadiness(tests: TestCase[]): number {
  if (tests.length === 0) return 0;
  const passed = tests.filter((t) => t.result === "PASS").length;
  return Math.round((passed / tests.length) * 100);
}

export function checkGate(tests: TestCase[], readiness: number): GateCheckResult {
  const reasons: string[] = [];
  if (tests.length === 0) reasons.push("NO_TESTS");
  if (readiness < 80) reasons.push("READINESS_TOO_LOW");
  if (tests.some((t) => t.result === "FAIL")) reasons.push("HAS_FAIL");
  return { allowed: reasons.length === 0, reasons };
}

export class DatabaseStorage implements IStorage {
  async getPrototypes(): Promise<PrototypeWithTests[]> {
    const allPrototypes = await db.select().from(prototypes);
    const allTests = await db.select().from(testCases);

    return allPrototypes.map((p) => {
      const tests = allTests.filter((t) => t.prototypeId === p.id);
      return { ...p, tests, readiness: calculateReadiness(tests) };
    });
  }

  async getPrototype(id: string): Promise<PrototypeWithTests | undefined> {
    const [prototype] = await db.select().from(prototypes).where(eq(prototypes.id, id));
    if (!prototype) return undefined;
    const tests = await db.select().from(testCases).where(eq(testCases.prototypeId, id));
    return { ...prototype, tests, readiness: calculateReadiness(tests) };
  }

  async createPrototype(data: InsertPrototype): Promise<Prototype> {
    const [prototype] = await db.insert(prototypes).values(data).returning();
    return prototype;
  }

  async updatePrototype(id: string, data: Partial<InsertPrototype>): Promise<Prototype | undefined> {
    const [updated] = await db
      .update(prototypes)
      .set(data)
      .where(eq(prototypes.id, id))
      .returning();
    return updated;
  }

  async updatePrototypeStatus(id: string, status: string): Promise<Prototype | undefined> {
    const [updated] = await db
      .update(prototypes)
      .set({ status })
      .where(eq(prototypes.id, id))
      .returning();
    return updated;
  }

  async deletePrototype(id: string): Promise<void> {
    await db.delete(testCases).where(eq(testCases.prototypeId, id));
    await db.delete(prototypes).where(eq(prototypes.id, id));
  }

  async createTestCase(data: InsertTestCase): Promise<TestCase> {
    const [testCase] = await db.insert(testCases).values(data).returning();
    return testCase;
  }

  async updateTestResult(id: string, result: string): Promise<TestCase | undefined> {
    const [updated] = await db
      .update(testCases)
      .set({ result })
      .where(eq(testCases.id, id))
      .returning();
    return updated;
  }

  async deleteTestCase(id: string): Promise<void> {
    await db.delete(testCases).where(eq(testCases.id, id));
  }
}

export const storage = new DatabaseStorage();
