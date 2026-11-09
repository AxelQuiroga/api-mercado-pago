import { MercadoPagoClient } from "./mercadopago.client.js";
import type { ProcessWebhookInput, ProcessWebhookOutput } from "./process-webhook.input.js";

export class ProcessPaymentWebhookService {
    constructor(private readonly client: MercadoPagoClient) {}

    async execute(input: ProcessWebhookInput): Promise<ProcessWebhookOutput> {
    if (input.type !== 'payment') {
        return { handled: false };
    }

    const payment = await this.client.getPayment(input.data.id);

    return {
        handled: true,
        payment: {
            id: payment.id,
            status: payment.status,
            transaction_amount: payment.transaction_amount,
            currency_id: payment.currency_id
        }
    };
}
}