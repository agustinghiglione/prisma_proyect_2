import './env';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { router } from './routes';
import './db'; // se asegura de que la base y sus tablas existan al arrancar

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/api/salud', (_req, res) => res.json({ ok: true }));

// En producción (Render) este mismo proceso sirve también el sitio ya
// compilado (`npm run build` → dist/), así hace falta un solo servicio, no
// dos. En desarrollo local no existe dist/ todavía (se usa el servidor de
// Vite con su proxy a /api) y este bloque simplemente no se activa.
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'No encontrado' });
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, () => {
  console.log(`[api] Prisma Consultora — backend escuchando en http://localhost:${PORT}`);
});
