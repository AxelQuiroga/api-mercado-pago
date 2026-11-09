import type { MercadoPagoClientOptions, MercadoPagoUser, MercadoPagoPreference, MercadoPagoPreferenceRequest, MercadoPagoPayment } from './mercadopago.types.js';
import {
  MercadoPagoConnectionError,
  MercadoPagoHttpError,
  MercadoPagoInvalidResponseError,
} from './mercadopago.errors.js';

export class MercadoPagoClient {
    private readonly accessToken: string;
    private readonly baseUrl: string;
    private readonly fetchImpl: typeof fetch;

    constructor(options: MercadoPagoClientOptions){
        if(!options.accessToken || options.accessToken.trim() === ''){
            throw new Error('MercadoPagoClient: accessToken es obligatorio');
        }

        this.accessToken = options.accessToken;
        this.baseUrl = (options.baseUrl || 'https://api.mercadopago.com').replace(/\/+$/, '');
        this.fetchImpl = options.fetchImpl ?? fetch;
    }


    async getMe(): Promise<MercadoPagoUser>{
        return this.request<MercadoPagoUser>('GET','/users/me');
    }

    private async request<T>(method: string,  path: string, body?: unknown): Promise<T>{
        const url = `${this.baseUrl}${path}`;

        let response: Response;
        try {
            response = await this.fetchImpl(url, {
                method,
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                ...(body !== undefined && { body: JSON.stringify(body) }),
            })
        } catch (error) {
            throw  new MercadoPagoConnectionError(`No se pudo conectar con Mercado Pago`, { cause: error instanceof Error ? error : undefined },
            );
        }

        if(!response.ok){
            const body = await this.safeParseBody(response);
            throw new MercadoPagoHttpError(response.status, response.statusText, body);
        }

        let data: unknown;

        try {
            data = await response.json();
        } catch (error) {
            throw new MercadoPagoInvalidResponseError(`La respuesta de Mercado Pago no es JSON valido.`,
                { cause: error instanceof Error ? error : undefined},

            );
        }
        return data as T;
    }

    private async safeParseBody(response: Response):Promise<unknown>{
        const text = await response.text();
        if(text === '')return null;
        try {
            return JSON.parse(text);
        } catch (error) {
            return text;
        }
    }

    public createPreference(input: MercadoPagoPreferenceRequest): Promise<MercadoPagoPreference>{
        return this.request<MercadoPagoPreference>('POST', '/checkout/preferences', input);
    }

    async getPayment(paymentId: string | number): Promise<MercadoPagoPayment> {
        return this.request<MercadoPagoPayment>('GET', `/v1/payments/${paymentId}`);
    }
}

