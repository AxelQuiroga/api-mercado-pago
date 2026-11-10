import type { NextFunction, Request, RequestHandler, Response } from "express";
import { type Env } from "../config/env.js";
import type { MercadoPagoClient } from "./mercadopago.client.js";
import { CreatePreferenceService } from "./create-preference.service.js";
import type { ProcessPaymentWebhookService } from "./process-webhook.service.js";

export class PaymentsController {
  constructor(
    private readonly mercadoPagoClient: MercadoPagoClient,
    private readonly createPreferenceService: CreatePreferenceService,
    private readonly processPaymentWebhookService: ProcessPaymentWebhookService,
  ) {}

  getMe: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const me = await this.mercadoPagoClient.getMe();
      res.status(200).json(me);
    } catch (error) {
      next(error);
    }
  };

  createPreference: RequestHandler = async (req, res, next) => {
    try {
      const output = await this.createPreferenceService.execute(req.body);
      res.status(201).json(output);
    } catch (error) {
      next(error);
    }
  };

  handleWebhook: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.processPaymentWebhookService.execute(req.body);
      res.status(200).json({received: true, handled: result.handled});
    } catch (error) {
      next(error);
    }
  }
}
