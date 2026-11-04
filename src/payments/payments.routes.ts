import { Router } from "express";
import { type Env } from "../config/env.js";
import { MercadoPagoClient } from "./mercadopago.client.js";
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { PaymentsController } from "./payments.controller.js";
import  { globalErrorHandler } from "../shared/error.middleware.js";

export function createPaymentsRouter(client: MercadoPagoClient): Router {
  const router = Router();

  const paymentsController = new PaymentsController(client)

  router.use(globalErrorHandler);
  router.get("/mercadopago/me" , async (req,res, next) => {
    await paymentsController.getMe(req,res,next);
  });

  return router;
}