export class MercadoPagoError extends Error {
    constructor(message: string, options?: ErrorOptions){
        super(message, options);
        this.name = this.constructor.name;
    }
}

export class MercadoPagoHttpError extends MercadoPagoError {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly body: unknown,
    ){
        super(`Mercado Pago HTTP ${status}: ${statusText}`);
        this.name = 'MercadoPagoHttpError';
    }

}

export class MercadoPagoInvalidResponseError extends MercadoPagoError {
    constructor(message: string, options?: ErrorOptions){
        super(message, options);
        this.name = 'MercadoPagoInvalidResponseError';
    }
}

export class MercadoPagoConnectionError extends MercadoPagoError {
    constructor(message: string, options?: ErrorOptions){
        super(message, options);
        this.name = 'MercadoPagoConnectionError';
    }
}