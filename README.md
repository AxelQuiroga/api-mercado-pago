# MERCADOpago — Backend inicial (Fase 0)

Backend inicial en TypeScript/Node.js para integrar la API REST de Mercado Pago.
Este milestone cubre la Fase 0: servidor Express funcional, configuración de entorno validada,
cliente HTTP propio (sin SDK) con autenticación Bearer, petición real a `GET /users/me`,
manejo de errores y health check.

## Stack

- Node.js 24+
- TypeScript 7 (strict, ESM via `nodenext`)
- Express 5
- Zod 4 (validación de entorno)
- Vitest 5 (tests)

## Requisitos previos

- Node.js >= 24
- npm
- Credenciales de prueba de Mercado Pago (Access Token y Public Key).
  Obtenelas desde el panel de desarrolladores de Mercado Pago:
  https://www.mercadopago.com/developers/panel/app

## Instalación

```bash
npm install
```

## Configuración de entorno

1. Copiá el template:

   ```bash
   cp .env.example .env
   ```

   En Windows (PowerShell):

   ```powershell
   Copy-Item .env.example .env
   ```

2. Editá `.env` y completá tus credenciales de prueba:

   ```env
   NODE_ENV=development
   PORT=3000
   MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token-de-prueba
   MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-de-prueba
   MERCADOPAGO_BASE_URL=https://api.mercadopago.com
   ```

> El archivo `.env` está gitignoreado. Nunca lo commitees ni lo compartas.
> Usá siempre credenciales de **prueba** (prefijo `TEST-`) en desarrollo.

## Scripts disponibles

| Comando            | Descripción                                            |
| ------------------ | ------------------------------------------------------ |
| `npm run dev`      | Inicia el servidor en modo watch (tsx).                |
| `npm run build`    | Compila TypeScript a `dist/`.                          |
| `npm run start`    | Ejecuta el build (`node dist/server.js`).              |
| `npm run typecheck`| Chequeo de tipos sin emitir archivos.                  |
| `npm test`         | Ejecuta los tests (Vitest, una sola corrida).         |
| `npm run test:watch` | Tests en modo watch.                                 |

## Endpoints

### Health check

```
GET /api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "timestamp": "2026-...",
  "uptime": 12.34,
  "environment": "development",
  "services": {
    "mercadoPagoConfigured": true
  }
}
```

### Usuario de Mercado Pago (petición real)

```
GET /api/mercadopago/me
```

Autentica con el `MERCADOPAGO_ACCESS_TOKEN` y devuelve el usuario de la cuenta
asociada. Útil para verificar que las credenciales funcionan.

Respuestas de error posibles:

- `503` — no se pudo conectar con Mercado Pago (red/DNS/timeout).
- `502` — Mercado Pago respondió pero rechazó la petición o devolvió un body inválido.
- `500` — error interno no clasificado.

## Estructura del proyecto

```
src/
  app.ts                      # Factory de la app Express
  server.ts                   # Entrypoint: carga dotenv, instancia cliente, listen
  config/
    env.ts                    # Validación de entorno con Zod
    env.test.ts               # Tests de config
  health/
    health.controller.ts      # Health check controller
    health.routes.ts          # Router de health
  payments/
    mercadopago.client.ts     # Cliente HTTP propio (fetch)
    mercadopago.client.test.ts# Tests con mock de fetch
    mercadopago.errors.ts     # Jerarquía de errores tipados
    mercadopago.types.ts      # Tipos del cliente
    payments.controller.ts    # Controller de payments
    payments.routes.ts        # Router de payments
  shared/
    error.middleware.ts       # Middleware de errores (503/502/500)
```

## Ejecutar y probar (paso a paso)

1. Instalá dependencias: `npm install`
2. Configurá `.env` con tus credenciales de prueba (ver arriba).
3. Levantá el servidor: `npm run dev`
4. Verificá el health check: abrí `http://localhost:3000/api/health`
5. Verificá la integración real: abrí `http://localhost:3000/api/mercadopago/me`
6. Corré los tests: `npm test`
7. Verificá tipos: `npm run typecheck`

## Testing

Los tests unitarios del cliente HTTP usan un mock de `fetch` inyectado por constructor,
sin tocar el global. Para correrlos:

```bash
npm test
```

Para modo watch:

```bash
npm run test:watch
```

## Seguridad

- Las credenciales viven solo en `.env` (gitignoreado).
- El cliente nunca loguea el `access_token` ni el header `Authorization`.
- El error middleware no filtra stacks ni detalles internos al cliente en producción.
- Usá siempre credenciales de prueba (`TEST-`) en desarrollo.

## Fuera del alcance de esta fase

No implementado todavía (viene en fases posteriores):

- Checkout / preferencias de pago
- Suscripciones
- Orders
- Webhooks
- Autenticación de usuarios
- PostgreSQL
- Frontend React

## Licencia

ISC
