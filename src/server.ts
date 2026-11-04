import 'dotenv/config';
import { createApp} from './app.js';
import { loadEnv } from './config/env.js';
import { MercadoPagoClient } from './payments/mercadopago.client.js';

const env = loadEnv();


const client = new MercadoPagoClient({ accessToken: env.MERCADOPAGO_ACCESS_TOKEN });
const app = createApp(env, client);

const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`Ambiente: ${env.NODE_ENV}`);
});