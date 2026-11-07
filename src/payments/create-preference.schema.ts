import { z } from 'zod';

export const preferenceItemSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  quantity: z
    .number()
    .int('La cantidad debe ser entera')
    .positive('La cantidad debe ser mayor a 0'),
  unit_price: z.number().positive('El precio unitario debe ser mayor a 0'),
  currency_id: z.string().min(3).max(3).toUpperCase().default('ARS'),
  description: z.string().optional(),
  picture_url: z.string().url('URL de imagen inválida').optional(),
  category_id: z.string().optional(),
});

export const backUrlsSchema = z.object({
  success: z.string().url('URL de éxito inválida'),
  failure: z.string().url('URL de fallo inválida').optional(),
  pending: z.string().url('URL de pendiente inválida').optional(),
});

export const payerSchema = z.object({
  email: z.string().email('Email inválido').optional(),
});

export const createPreferenceSchema = z.object({
  items: z.array(preferenceItemSchema).min(1, 'Debe incluir al menos un item'),
  back_urls: backUrlsSchema.optional(),
  auto_return: z.enum(['approved', 'all']).optional(),
  payer: payerSchema.optional(),
  external_reference: z.string().optional(),
  notification_url: z.string().url('URL de notificación inválida').optional(),
  statement_descriptor: z.string().max(16, 'Máximo 16 caracteres').optional(),
});

export type CreatePreferenceInput = z.infer<typeof createPreferenceSchema>;
