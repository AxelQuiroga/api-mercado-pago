import { Router } from "express";
import { MercadoPagoClient } from "./mercadopago.client.js";
import { PaymentsController } from "./payments.controller.js";
import  { globalErrorHandler } from "../shared/error.middleware.js";
import { CreatePreferenceService } from "./create-preference.service.js";
import { validateBody } from "../shared/validation.middleware.js";
import { createPreferenceSchema } from "./create-preference.schema.js";
import type { ProcessPaymentWebhookService } from "./process-webhook.service.js";
import { mercadopagoWebhookSchema } from "./webhook.schema.js";

export function createPaymentsRouter(client: MercadoPagoClient, createPreferenceService : CreatePreferenceService, processPaymentWebhookService: ProcessPaymentWebhookService): Router {
  const router = Router();

  const paymentsController = new PaymentsController(client, createPreferenceService, processPaymentWebhookService);

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

  router.post("/mercadopago/webhook", validateBody(mercadopagoWebhookSchema), async ( req, res, next) => {
    await paymentsController.handleWebhook(req, res, next);
  })
  router.use(globalErrorHandler);

  return router;
}