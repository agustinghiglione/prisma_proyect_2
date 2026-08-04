# Backend — Prisma Consultora

API mínima que guarda cada Diagnóstico Prisma® completado como una fila nueva
en la planilla de Google Sheets **"Diagnósticos Prisma"**. No hay base de
datos ni panel propio: la planilla es el panel.

## Stack

- Node.js + Express
- Google Sheets API v4 (`googleapis`), autenticado con una service account

## Antes de arrancar

1. La planilla "Diagnósticos Prisma" tiene que estar **compartida como
   Editor** con el email de la service account (`client_email` dentro del
   `.json` de credenciales — algo como
   `nombre@proyecto.iam.gserviceaccount.com`). Sin este paso, la API no puede
   escribir filas aunque las credenciales sean correctas.
2. Copiar el `.json` de credenciales a `backend/` (nunca se commitea, está en
   `.gitignore`).
3. Revisar `GOOGLE_SHEET_TAB`: es el nombre de la **pestaña** (la solapita
   abajo en Google Sheets), no el nombre del archivo. Si nunca se renombró,
   suele ser `Sheet1` aunque el archivo se llame "Diagnósticos Prisma".

## Variables de entorno

Ver `.env.example`.

## Desarrollo local

```bash
npm install
npm start
```

## Endpoint

- `GET /` — health check.
- `POST /api/diagnostics` — público. Recibe:
  ```json
  {
    "name": "...",
    "company": "...",
    "email": "...",
    "answers": ["...", "...", "...", "...", "...", "..."],
    "resultado": "68%",
    "prioridades": ["...", "...", "..."]
  }
  ```
  y agrega una fila a la planilla con: ID (autoincremental, calculado por
  cantidad de filas existentes), fecha, los datos de contacto, las 6
  respuestas, el resultado, las 3 prioridades, y cuatro columnas vacías
  (Informe enviado / Primera conversación / Cliente / Observaciones) para que
  el equipo las complete a mano al hacer seguimiento.
