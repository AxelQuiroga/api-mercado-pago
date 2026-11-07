import { describe, expect, it } from 'vitest';
import { createPreferenceSchema } from './create-preference.schema.js';

describe('createPreferenceSchema', () => {
  const validPayload = {
    items: [
      {
        title: 'Curso de TypeScript',
        quantity: 2,
        unit_price: 2500,
      },
    ],
  };

  it('valida exitosamente y aplica default currency_id ARS', () => {
    const result = createPreferenceSchema.safeParse(validPayload);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items[0]?.currency_id).toBe('ARS');
      expect(result.data.items[0]?.quantity).toBe(2);
      expect(result.data.items[0]?.unit_price).toBe(2500);
    }
  });

  it('falla si items es un array vacio', () => {
    const result = createPreferenceSchema.safeParse({
      items: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/al menos un item/i);
    }
  });

  it('falla si quantity es decimal o menor a 1', () => {
    const resultZero = createPreferenceSchema.safeParse({
      items: [{ title: 'Item', quantity: 0, unit_price: 100 }],
    });
    expect(resultZero.success).toBe(false);

    const resultDecimal = createPreferenceSchema.safeParse({
      items: [{ title: 'Item', quantity: 1.5, unit_price: 100 }],
    });
    expect(resultDecimal.success).toBe(false);
  });

  it('falla si unit_price es menor o igual a 0', () => {
    const resultNegative = createPreferenceSchema.safeParse({
      items: [{ title: 'Item', quantity: 1, unit_price: -10 }],
    });
    expect(resultNegative.success).toBe(false);

    const resultZero = createPreferenceSchema.safeParse({
      items: [{ title: 'Item', quantity: 1, unit_price: 0 }],
    });
    expect(resultZero.success).toBe(false);
  });

  it('falla si back_urls contiene URLs invalidas', () => {
    const result = createPreferenceSchema.safeParse({
      ...validPayload,
      back_urls: {
        success: 'no-es-una-url',
      },
    });

    expect(result.success).toBe(false);
  });

  it('falla si payer.email tiene formato invalido', () => {
    const result = createPreferenceSchema.safeParse({
      ...validPayload,
      payer: {
        email: 'correo-trucho',
      },
    });

    expect(result.success).toBe(false);
  });
});
