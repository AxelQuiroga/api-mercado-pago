import { describe, expect, it} from 'vitest';
import { loadEnv } from './env.js';


describe('loadEnv', () => {
  it('parsea valores válidos', () => {
    const env = loadEnv({
      NODE_ENV: 'test',
      PORT: '4000',
      MERCADOPAGO_ACCESS_TOKEN: 'TEST-abc',
    });

    expect(env.NODE_ENV).toBe('test');
    expect(env.PORT).toBe(4000);
    expect(env.MERCADOPAGO_BASE_URL).toBe('https://api.mercadopago.com');
  });

  it('lanza EnvValidationError si falta el access token', () => {
    expect(() => loadEnv({PORT: '3000'})).toThrow();
  });
});