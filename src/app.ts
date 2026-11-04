import  express , {type Application } from 'express';
import type {Env} from './config/env.js';
import { createHealthRouter } from './health/health.routes.js';


export function createApp(env: Env): Application{
    const app = express();
    app.use(express.json());

    app.use('/api',createHealthRouter(env));

    return app;
}