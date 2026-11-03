export interface MercadoPagoClientOptions {
    accessToken: string;
    baseUrl?: string;
    fetchImpl?: typeof fetch;
}

export interface MercadoPagoUser {
    id: number;
    nickname?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    country_id?: string;
    site_id?: string;
    registration_date?: string;
}