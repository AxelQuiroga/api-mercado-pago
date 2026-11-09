import { describe, expect, it, vi } from "vitest";
import { MercadoPagoClient } from "./mercadopago.client.js";
import { ProcessPaymentWebhookService } from "./process-webhook.service.js";
import type { ProcessWebhookInput } from "./process-webhook.input.js";
import { MercadoPagoHttpError } from "./mercadopago.errors.js";

describe("processWebhookService", () => {
  it("devuelve el estado del pago mapeado cuando el cliente responde exitosamente", async () => {
    const mockPaymentResponse = {
      id: 123,
      status: "approved",
      transaction_amount: 100,
      currency_id: "ARS",
    };

    const mockClient = {
      getPayment: vi.fn().mockResolvedValueOnce(mockPaymentResponse),
    } as unknown as MercadoPagoClient;

    const service = new ProcessPaymentWebhookService(mockClient);

    const input: ProcessWebhookInput = { type: "payment", data: { id: 123 } };
    const result = await service.execute(input);

    expect(mockClient.getPayment).toHaveBeenCalledTimes(1);
    expect(mockClient.getPayment).toHaveBeenCalledWith(123);

    expect(result).toEqual({
      handled: true,
      payment: mockPaymentResponse,
    });
  });

  it("tipo ignorado", async () => {
    const mockClient = { getPayment: vi.fn() } as unknown as MercadoPagoClient;
    const service = new ProcessPaymentWebhookService(mockClient);
    const input: ProcessWebhookInput = { type: "other", data: { id: 123 } };
    const result = await service.execute(input);
    expect(result).toEqual({ handled: false });
    expect(mockClient.getPayment).not.toHaveBeenCalled();
  });

  it("error propagation", async () => {
    const mockClient = {
      getPayment: vi
        .fn()
        .mockRejectedValueOnce(
          new MercadoPagoHttpError(400, "Bad Request", {
            message: "payment not found",
          }),
        ),
    } as unknown as MercadoPagoClient;

    const service = new ProcessPaymentWebhookService(mockClient);
    const input: ProcessWebhookInput = { type: "payment", data: { id: 123 } };
    await expect(service.execute(input)).rejects.toBeInstanceOf(
      MercadoPagoHttpError,
    );
  });
});
