import { MercadoPagoClient } from "./mercadopago.client.js";
import type { CreatePreferenceInput, CreatePreferenceOutput } from "./create-preference.input.js";
export class CreatePreferenceService {
    /*
Constructor recibe MercadoPagoClient (inyectado).
Método execute(input): Promise<CreatePreferenceOutput>.
Dentro: llama a this.client.createPreference(input) y mapea la respuesta a un output propio.
No captura errores: los deja propagar al middleware. El servicio no decide qué HTTP status devolver;
 eso es responsabilidad del middleware.
Por qué no capturar: si el servicio captura y transforma errores, el middleware pierde información 
(el instanceof). Al propagar, el middleware puede distinguir MercadoPagoHttpError de MercadoPagoConnectionError
 y responder con el status correcto.
Qué es el output: un tipo propio con id, init_point, sandbox_init_point. No devolvés el tipo
 del cliente directamente (mismo principio que el input)    
    
    */
   constructor(private readonly client: MercadoPagoClient) {}

   async execute(input: CreatePreferenceInput): Promise<CreatePreferenceOutput>{
    const preference = await this.client.createPreference(input)
    return {
        id: preference.id,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point
    }
   }

}