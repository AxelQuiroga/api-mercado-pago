import type{ Request, Response, NextFunction } from 'express';

import { MercadoPagoError, MercadoPagoHttpError, MercadoPagoInvalidResponseError, MercadoPagoConnectionError } from "../payments/mercadopago.errors.js";


export const globalErrorHandler = (err: MercadoPagoError, req: Request, res: Response, next: NextFunction) => {
    err.message = err.message 
    
    if(err instanceof MercadoPagoHttpError){
        res.status(502).json({
            status: 502,
            message: err.message,
            body: err.message
        });
            
    }

    if(err instanceof MercadoPagoInvalidResponseError){
        res.status(502).json({
            status: 502,
            message: err.message
        })
    }

    if(err instanceof MercadoPagoConnectionError){
        res.status(503).json({
            status: 503,
            message: err.message
        })
    }

    res.status(500).json({
        status: 500,
        message: 'Internal Server Error'
    })
}

/*const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    try {
        if(err instanceof MercadoPagoError){
        res.status(502).json({
            status: 502,
            message: err.message,
            body: err.message
        });

    }
    } catch (error) {
     res.status(500).json   
    }
}*/