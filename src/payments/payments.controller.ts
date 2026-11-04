import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { type Env } from '../config/env.js';
import type { MercadoPagoClient } from './mercadopago.client.js';

export class PaymentsController{
    constructor(private readonly mercadoPagoClient: MercadoPagoClient){}
    
    getMe: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const me = await this.mercadoPagoClient.getMe()
           res.status(200).json(me);
        } catch (error) {
            next(error);
        }
    }
}