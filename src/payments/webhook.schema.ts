import { z } from 'zod';

export const mercadopagoWebhookSchema = z.object({
    type: z.string().min(1),
    data: z.object({
        id: z.union([z.string(), z.number()])
    }),
    action: z.string().min(1).optional(), 
    date_created: z.string().min(1).optional(),
    live_mode: z.string().min(1).optional()
}) 

export type MercadopagoWebhookPayload = z.infer<typeof mercadopagoWebhookSchema>;