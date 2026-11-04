import { Router } from "express";
import { type Env } from "../config/env.js";
import { HealthController } from "../health/health.controller.js";

export function createHealthRouter(env: Env): Router {
  //const env: Env = loadEnv();
  const healthController = new HealthController(env);

  const router = Router();

  router.get("/health", healthController.check);

  return router;
}
