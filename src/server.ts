import 'dotenv/config';
import { createApp} from './app.js';
import { loadEnv } from './config/env.js';

const env = loadEnv();

const app = createApp(env);

const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`Ambiente: ${env.NODE_ENV}`);
});