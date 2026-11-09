import { describe, expect, it, vi } from 'vitest';
import {  mercadopagoWebhookSchema } from './webhook.schema.js';

describe('webhookSchema', () => {
    it('valida el esquema', () => {
        const result = mercadopagoWebhookSchema.safeParse({
            type: 'payment',
            data: {
                id: '123'
            },
            action: 'payment.created',
            date_created: '2023-01-01',
            live_mode: 'true'
        })
        expect(result.success).toBe(true)
    });

    it('valida si id es como number', () => {
        const result = mercadopagoWebhookSchema.safeParse({
            type: 'payment',
            data: {
                id: 123
            },
            action: 'payment.created',
            date_created: '2023-01-01',
            live_mode: 'true'
        })
        expect(result.success).toBe(true);
    });

    it('falla si falta type', () => {
        const result = mercadopagoWebhookSchema.safeParse({
            data: {
                id: '123'
            },
            action: 'payment.created',
            date_created: '2023-01-01',
            live_mode: 'true'
        })
        expect(result.success).toBe(false);
    });

    it('falla si falta data.id', () => {
        const result = mercadopagoWebhookSchema.safeParse({
            type: 'payment',
            action: 'payment.created',
            date_created: '2023-01-01',
            live_mode: 'true'
        })
        expect(result.success).toBe(false);
    })
})
