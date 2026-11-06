import { describe, expect, it, vi } from 'vitest';
import { MercadoPagoClient } from './mercadopago.client.js';
import { MercadoPagoConnectionError } from './mercadopago.errors.js';
import { MercadoPagoHttpError } from './mercadopago.errors.js';
import { MercadoPagoInvalidResponseError } from './mercadopago.errors.js';

describe('MercadoPagoClient', () => {
  it('getMe devuelve el usuario en respuesta 200', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 123, nickname: 'test_user' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const client = new MercadoPagoClient({
      accessToken: 'TEST-token',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const user = await client.getMe();

    expect(user.id).toBe(123);
    expect(user.nickname).toBe('test_user');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.mercadopago.com/users/me',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer TEST-token',
        }),
      }),
    );
  });

  it('lanza MercadoPagoHttpError en respuesta no-2xx con status y body', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'invalid token' }), {
        status: 401,
        statusText: 'Unauthorized',
      }),
    );

    const client = new MercadoPagoClient({
      accessToken: 'bad-token',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    try {
      await client.getMe();
      throw new Error('se esperaba que lanzara');
    } catch (error) {
      expect(error).toBeInstanceOf(MercadoPagoHttpError);
      expect((error as MercadoPagoHttpError).status).toBe(401);
      expect((error as MercadoPagoHttpError).body).toEqual({ message: 'invalid token' });
    }
  });

  it('lanza MercadoPagoInvalidResponseError si el body no es JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('<html>gateway error</html>', { status: 200 }),
    );

    const client = new MercadoPagoClient({
      accessToken: 'TEST-token',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(client.getMe()).rejects.toBeInstanceOf(MercadoPagoInvalidResponseError);
  });

  it('lanza MercadoPagoConnectionError si fetch rechaza', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    const client = new MercadoPagoClient({
      accessToken: 'TEST-token',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(client.getMe()).rejects.toBeInstanceOf(MercadoPagoConnectionError);
  });

  it('normaliza baseUrl con slash final', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 1 }), { status: 200 }),
    );

    const client = new MercadoPagoClient({
      accessToken: 'TEST-token',
      baseUrl: 'https://example.com/',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await client.getMe();
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/users/me', expect.anything());
  });

  it('falla en el constructor si no hay accessToken', () => {
    expect(
      () =>
        new MercadoPagoClient({
          accessToken: '',
          fetchImpl: vi.fn() as unknown as typeof fetch,
        }),
    ).toThrow();
  });

  it('createPreference devuelve la preferencia en respuesta 201', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 1, init_point: 'https://example.com', sandbox_init_point: 'https://example.com' }), {status:201, headers: { 'Content-Type': 'application/json' }})
    );

    const client = new MercadoPagoClient({
      accessToken: 'TEST-token',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const result = await client.createPreference({back_urls: {success: 'https://example.com/success'}, items: [{title: 'test',quantity: 1, unit_price: 20, currency_id: 'ARS'}]});
    expect(result.id).toBe(1)
    expect(result.init_point).toBe('https://example.com')
    expect(result.sandbox_init_point).toBe('https://example.com')
    expect(fetchMock).toHaveBeenCalledWith('https://api.mercadopago.com/checkout/preferences', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        Authorization: 'Bearer TEST-token',
      }),
      body: JSON.stringify({back_urls: {success: 'https://example.com/success'},items: [{title: 'test',quantity: 1, unit_price: 20, currency_id: 'ARS'}]}),
    }));
  });

  it('createPreference lanza MercadoPagoHttpError en respuesta 400', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'invalid items'}) ,{status: 400, statusText:'Bad Request'})
    )

    const client = new MercadoPagoClient({
      accessToken: 'TEST-token',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    try {
      await client.createPreference({back_urls: {success: 'https://example.com/success'}, items: [{title: 'test',quantity: 1, unit_price: 0, currency_id: 'ARS'}]});
      throw new Error('se esperaba que lanzara')
    } catch (error) {
      expect(error).toBeInstanceOf(MercadoPagoHttpError);
      expect((error as MercadoPagoHttpError).status).toBe(400);
      expect((error as MercadoPagoHttpError).body).toEqual({ message: 'invalid items' });
    }
  })

  it('error de conexion', async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const client = new MercadoPagoClient({
      accessToken: 'TEST-token',
      fetchImpl: fetchMock as unknown as typeof fetch,
    })

    try {
      await client.createPreference({back_urls: {success: 'https://example.com/success'}, items: [{title: 'test',quantity: 1, unit_price: 0, currency_id: 'ARS'}]});
      throw new Error('se esperaba que lanzara')
    } catch (error) {
      expect(error).toBeInstanceOf(MercadoPagoConnectionError);
    }
  })

  it('Respuesta invalida', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response('<html>gateway error</html>', { status: 200 }),
    );

    const client = new MercadoPagoClient({
      accessToken: 'TEST-token',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    try {
      await client.createPreference( {back_urls: {success: 'https://example.com/success'}, items: [{title: 'test',quantity: 1, unit_price: 0, currency_id: 'ARS'}]});
       throw new Error('Respuesta invalida')
    } catch (error) {
      expect(error).toBeInstanceOf(MercadoPagoInvalidResponseError);
    }
  })
});