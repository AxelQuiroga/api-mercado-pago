import { Router } from "express";
import { MercadoPagoClient } from "./mercadopago.client.js";
import { PaymentsController } from "./payments.controller.js";
import  { globalErrorHandler } from "../shared/error.middleware.js";
import { CreatePreferenceService } from "./create-preference.service.js";
import { validateBody } from "../shared/validation.middleware.js";
import { createPreferenceSchema } from "./create-preference.schema.js";

export function createPaymentsRouter(client: MercadoPagoClient, createPreferenceService : CreatePreferenceService): Router {
  const router = Router();

  const paymentsController = new PaymentsController(client, createPreferenceService)

  router.get("/mercadopago/me" , async (req,res, next) => {
    await paymentsController.getMe(req,res,next);
  });

  router.post(
  "/mercadopago/preferences",
  validateBody(createPreferenceSchema),
  async (req, res, next) => {
    await paymentsController.createPreference(req, res, next);
  }
);
  router.use(globalErrorHandler);

  return router;
}