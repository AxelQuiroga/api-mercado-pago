import  express , {type Application } from 'express';
import type {Env} from './config/env.js';
import { createHealthRouter } from './health/health.routes.js';
import { createPaymentsRouter } from './payments/payments.routes.js';
import { MercadoPagoClient } from './payments/mercadopago.client.js';

export function createApp(env: Env, client: MercadoPagoClient): Application{
    const app = express();
    app.use(express.json());

    app.use('/api',createHealthRouter(env));
    app.use('/api', createPaymentsRouter(client),)

    return app;
}