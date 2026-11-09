export interface MercadoPagoClientOptions {
  accessToken: string;
  baseUrl?: string | undefined;
  fetchImpl?: typeof fetch | undefined;
}

export interface MercadoPagoUser {
  id: number;
  nickname?: string | undefined;
  first_name?: string | undefined;
  last_name?: string | undefined;
  email?: string | undefined;
  country_id?: string | undefined;
  site_id?: string | undefined;
  registration_date?: string | undefined;
}

export interface MercadoPagoPreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  description?: string | undefined;
  picture_url?: string | undefined;
  category_id?: string | undefined;
}

export interface MercadoPagoPayerPhone {
  area_code?: string | undefined;
  number?: string | undefined;
}

export interface MercadoPagoPayerIdentification {
  type?: string | undefined;
  number?: string | undefined;
}

export interface MercadoPagoPayer {
  email?: string | undefined;
  phone?: MercadoPagoPayerPhone | undefined;
  identification?: MercadoPagoPayerIdentification | undefined;
}

export interface MercadoPagoBackUrls {
  success: string;
  failure?: string | undefined;
  pending?: string | undefined;
}

export interface MercadoPagoPreferenceRequest {
  items: MercadoPagoPreferenceItem[];
  payer?: MercadoPagoPayer | undefined;
  back_urls?: MercadoPagoBackUrls | undefined;
  auto_return?: 'approved' | 'all' | undefined;
  notification_url?: string | undefined;
  external_reference?: string | undefined;
  statement_descriptor?: string | undefined;
}

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  date_created: string;
}

export type MercadoPagoPaymentStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'cancelled' 
  | 'expired';

export interface MercadoPagoPayment {
  id: number,
  status: MercadoPagoPaymentStatus,
  transaction_amount: number,
  currency_id: string,
  external_reference?: string | undefined
}
