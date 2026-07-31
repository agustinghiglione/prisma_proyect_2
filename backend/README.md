# Backend — Prisma Consultora

API mínima que persiste cada Diagnóstico Prisma® completado y expone un panel interno simple para revisarlos.

## Stack

- Node.js + Express
- PostgreSQL (vía `pg`, sin ORM)

## Variables de entorno

Ver `.env.example`. Copiarlo como `.env` para desarrollo local:

- `DATABASE_URL` — cadena de conexión a Postgres.
- `PGSSL=false` — solo para Postgres local sin SSL. En producción (DigitalOcean) no definir esta variable.
- `ADMIN_PASSWORD` — contraseña del panel interno en `/admin`.
- `FRONTEND_URL` — origen permitido para CORS (la URL del sitio deployado).
- `PORT` — puerto de escucha (DigitalOcean lo inyecta automáticamente).

## Desarrollo local

```bash
npm install
npm start
```

Las migraciones se aplican automáticamente al arrancar el servidor (son
idempotentes, seguras de correr en cada boot). También se pueden correr
manualmente con `npm run migrate` si hace falta.

## Endpoints

- `GET /` — health check.
- `POST /api/diagnostics` — público. Recibe `{ name, company, email, priority, answers, report }` y lo guarda.
- `GET /api/diagnostics` — protegido. Requiere el header `x-admin-password`. Devuelve todos los registros.
- `GET /admin` — panel HTML simple (pide la misma contraseña) para ver los diagnósticos guardados.
