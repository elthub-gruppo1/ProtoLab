import { db } from "./db";
import { prototypes, testCases } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seed() {
  const existing = await db.select().from(prototypes);
  if (existing.length > 0) return;

  const [p1] = await db.insert(prototypes).values({
    name: "Thermal Shield v2",
    area: "Space",
    owner: "Marco Rossi",
    targetDate: "2026-06-15",
    status: "TEST",
  }).returning();

  const [p2] = await db.insert(prototypes).values({
    name: "LiDAR Sensor Module",
    area: "Automotive",
    owner: "Elena Bianchi",
    targetDate: "2026-04-20",
    status: "BUILD",
  }).returning();

  const [p3] = await db.insert(prototypes).values({
    name: "Robotic Arm Joint",
    area: "Industrial",
    owner: "Alessandro Verdi",
    targetDate: "2026-08-01",
    status: "DESIGN",
  }).returning();

  const [p4] = await db.insert(prototypes).values({
    name: "Radiation Hardened PCB",
    area: "Space",
    owner: "Giulia Neri",
    targetDate: "2026-03-10",
    status: "READY",
  }).returning();

  await db.insert(testCases).values([
    { prototypeId: p1.id, title: "Thermal resistance at 200C", type: "ENVIRONMENTAL", result: "PASS" },
    { prototypeId: p1.id, title: "Vibration stress test", type: "ENVIRONMENTAL", result: "PASS" },
    { prototypeId: p1.id, title: "UV degradation check", type: "FUNCTIONAL", result: "NOT_RUN" },
    { prototypeId: p1.id, title: "Shield integration with chassis", type: "INTEGRATION", result: "PASS" },
  ]);

  await db.insert(testCases).values([
    { prototypeId: p2.id, title: "Range accuracy test", type: "FUNCTIONAL", result: "NOT_RUN" },
    { prototypeId: p2.id, title: "Rain interference test", type: "ENVIRONMENTAL", result: "NOT_RUN" },
  ]);

  await db.insert(testCases).values([
    { prototypeId: p4.id, title: "Radiation tolerance 50krad", type: "ENVIRONMENTAL", result: "PASS" },
    { prototypeId: p4.id, title: "Signal integrity check", type: "FUNCTIONAL", result: "PASS" },
    { prototypeId: p4.id, title: "Power module integration", type: "INTEGRATION", result: "PASS" },
    { prototypeId: p4.id, title: "Thermal cycling -40C to 85C", type: "ENVIRONMENTAL", result: "PASS" },
    { prototypeId: p4.id, title: "EMI compliance test", type: "FUNCTIONAL", result: "PASS" },
  ]);

  console.log("Seed data inserted successfully");
}
