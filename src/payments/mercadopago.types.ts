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

export interface MercadoPagoPreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
}

export interface MercadoPagoPreferenceRequest {
  items: MercadoPagoPreferenceItem[];
  payer?: MercadoPagoPayer;
  back_urls?: MercadoPagoBackUrls;
  auto_return?: 'approved' | 'all';
  notification_url?: string;
  external_reference?: string;
  statement_descriptor?: string;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  date_created: string;
}



export interface MercadoPagoPayerPhone {
    area_code?: string,
    number?: string
}

export interface MercadoPagoPayerIdentification {
    type?: string,
    number?: string
}

export interface MercadoPagoPayer {
    email?: string,
    phone?: MercadoPagoPayerPhone,
    identification?: MercadoPagoPayerIdentification
}

export interface MercadoPagoBackUrls {
  success: string;
  failure?: string;
  pending?: string;
}