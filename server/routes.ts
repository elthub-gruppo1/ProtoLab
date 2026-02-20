import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, checkGate } from "./storage";
import { insertPrototypeSchema, insertTestCaseSchema, updateTestResultSchema } from "@shared/schema";
import { ZodError } from "zod";

function handleZodError(error: unknown) {
  if (error instanceof ZodError) {
    return { status: 400, body: { message: error.errors.map((e) => e.message).join(", ") } };
  }
  return null;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/prototypes", async (_req, res) => {
    const prototypes = await storage.getPrototypes();
    res.json(prototypes);
  });

  app.get("/api/prototypes/:id", async (req, res) => {
    const prototype = await storage.getPrototype(req.params.id);
    if (!prototype) return res.status(404).json({ message: "Prototype not found" });
    res.json(prototype);
  });

  app.post("/api/prototypes", async (req, res) => {
    try {
      const data = insertPrototypeSchema.parse(req.body);
      const prototype = await storage.createPrototype(data);
      res.status(201).json(prototype);
    } catch (error) {
      const zodErr = handleZodError(error);
      if (zodErr) return res.status(zodErr.status).json(zodErr.body);
      throw error;
    }
  });

  app.patch("/api/prototypes/:id", async (req, res) => {
    try {
      const data = insertPrototypeSchema.partial().parse(req.body);
      const updated = await storage.updatePrototype(req.params.id, data);
      if (!updated) return res.status(404).json({ message: "Prototype not found" });
      res.json(updated);
    } catch (error) {
      const zodErr = handleZodError(error);
      if (zodErr) return res.status(zodErr.status).json(zodErr.body);
      throw error;
    }
  });

  app.post("/api/prototypes/:id/advance", async (req, res) => {
    const prototype = await storage.getPrototype(req.params.id);
    if (!prototype) return res.status(404).json({ message: "Prototype not found" });

    const statusFlow: Record<string, string> = {
      DESIGN: "BUILD",
      BUILD: "TEST",
      TEST: "READY",
    };

    const nextStatus = statusFlow[prototype.status];
    if (!nextStatus) {
      return res.status(400).json({ message: "Prototype is already READY" });
    }

    if (nextStatus === "READY") {
      const gate = checkGate(prototype.tests, prototype.readiness);
      if (!gate.allowed) {
        const reasonMessages: Record<string, string> = {
          NO_TESTS: "At least one test case is required",
          READINESS_TOO_LOW: "Readiness must be at least 80%",
          HAS_FAIL: "There are failing tests",
        };
        const message = gate.reasons.map((r) => reasonMessages[r] || r).join(". ");
        return res.status(400).json({ message, reasons: gate.reasons });
      }
    }

    const updated = await storage.updatePrototypeStatus(prototype.id, nextStatus);
    res.json(updated);
  });

  app.delete("/api/prototypes/:id", async (req, res) => {
    await storage.deletePrototype(req.params.id);
    res.status(204).end();
  });

  app.post("/api/test-cases", async (req, res) => {
    try {
      const data = insertTestCaseSchema.parse(req.body);
      const prototypeExists = await storage.getPrototype(data.prototypeId);
      if (!prototypeExists) return res.status(404).json({ message: "Prototype not found" });
      const testCase = await storage.createTestCase(data);
      res.status(201).json(testCase);
    } catch (error) {
      const zodErr = handleZodError(error);
      if (zodErr) return res.status(zodErr.status).json(zodErr.body);
      throw error;
    }
  });

  app.patch("/api/test-cases/:id", async (req, res) => {
    try {
      const { result } = updateTestResultSchema.parse(req.body);
      const updated = await storage.updateTestResult(req.params.id, result);
      if (!updated) return res.status(404).json({ message: "Test case not found" });
      res.json(updated);
    } catch (error) {
      const zodErr = handleZodError(error);
      if (zodErr) return res.status(zodErr.status).json(zodErr.body);
      throw error;
    }
  });

  app.delete("/api/test-cases/:id", async (req, res) => {
    await storage.deleteTestCase(req.params.id);
    res.status(204).end();
  });

  return httpServer;
}
