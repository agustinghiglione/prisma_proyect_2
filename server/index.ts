import './env';
import express from 'express';
import cors from 'cors';
import { router } from './routes';
import './db'; // se asegura de que la base y sus tablas existan al arrancar

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/api/salud', (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, () => {
  console.log(`[api] Prisma Consultora — backend escuchando en http://localhost:${PORT}`);
});
