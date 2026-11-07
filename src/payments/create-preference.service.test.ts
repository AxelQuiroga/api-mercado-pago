import { describe, expect, it, vi } from "vitest";
import { MercadoPagoClient } from "./mercadopago.client.js";
import { CreatePreferenceService } from "./create-preference.service.js";
import { CreatePreferenceInput } from "./create-preference.input.js";
import { MercadoPagoHttpError } from './mercadopago.errors.js';

describe("CreatePreferenceService", () => {
  describe("execute", () => {
    it("devuelve la preferencia mapeada cuando el cliente responde exitosamente", async () => {
      
      const mockPreferenceResponse = {
        id: "pref-123",
        init_point: "https://mercadopago.com/checkout/pref-123",
        sandbox_init_point: "https://sandbox.mercadopago.com/checkout/pref-123",
        date_created: "2026-11-06T12:00:00Z",
      };
      
      const mockClient = {
        createPreference: vi.fn().mockResolvedValueOnce(mockPreferenceResponse),
      } as unknown as MercadoPagoClient;

      const service = new CreatePreferenceService(mockClient);

      const input: CreatePreferenceInput = { items: [
          {
            title: "Remera Redonda",
            quantity: 1,
            unit_price: 1500,
            currency_id: "ARS",
          },
        ],};
      const result = await service.execute(input);

      expect(mockClient.createPreference).toHaveBeenCalledTimes(1);
      expect(mockClient.createPreference).toHaveBeenCalledWith(input);

      expect(result).toEqual({
        id: "pref-123",
        init_point: "https://mercadopago.com/checkout/pref-123",
        sandbox_init_point: "https://sandbox.mercadopago.com/checkout/pref-123",
      });
    });

    it("propaga MercadoPagoHttpError si el cliente falla con error HTTP", async () => {
  // 1. Arrange: creamos el error específico del cliente
  const clientError = new MercadoPagoHttpError(400, "Bad Request", {
    message: "invalid items",
  });

  const mockClient = {
    createPreference: vi.fn().mockRejectedValueOnce(clientError),
  } as unknown as MercadoPagoClient;

  const service = new CreatePreferenceService(mockClient);

  const input: CreatePreferenceInput = {
    items: [
      {
        title: "Test",
        quantity: 1,
        unit_price: 100,
        currency_id: "ARS",
      },
    ],
  };

  // 2. Act & Assert: verificamos que la promesa rechace con la MISMA instancia
  await expect(service.execute(input)).rejects.toThrow(clientError);
});
  });
});
