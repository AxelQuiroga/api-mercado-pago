import type {  MercadoPagoPaymentStatus } from "./mercadopago.types.js";

export interface ProcessWebhookInput {
    type: string;
    data: {
        id: string | number
    }
}

export interface VerifiedPaymentResult {
    id: number;
    status:  MercadoPagoPaymentStatus;
    transaction_amount: number;
    currency_id: string;
}

export interface ProcessWebhookOutput {
    handled: boolean
    payment?: VerifiedPaymentResult
}