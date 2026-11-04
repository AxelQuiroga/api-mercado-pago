import type { Request, Response } from 'express';
import { type Env } from '../config/env.js';



export class HealthController {
    constructor(private readonly env: Env) {}

    public check = (req: Request, res: Response): void => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: this.env.NODE_ENV,
            services: {
                mercadoPagoConfigured: Boolean(this.env.MERCADOPAGO_ACCESS_TOKEN),
            }
        })
    }
}