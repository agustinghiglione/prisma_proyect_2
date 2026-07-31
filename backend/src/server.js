import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import { runMigrations } from './migrate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: '100kb' }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? '*',
  }),
);
app.use('/admin', express.static(path.join(__dirname, '..', 'public', 'admin')));

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/diagnostics', async (req, res) => {
  const { name, company, email, priority, answers, report } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    typeof company !== 'string' ||
    typeof email !== 'string' ||
    !name.trim() ||
    !company.trim() ||
    !EMAIL_RE.test(email) ||
    typeof answers !== 'object' ||
    answers === null ||
    typeof report !== 'object' ||
    report === null
  ) {
    return res.status(400).json({ error: 'Datos de diagnóstico inválidos.' });
  }

  try {
    await pool.query(
      `INSERT INTO diagnostics (name, company, email, priority, answers, report)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        name.trim(),
        company.trim(),
        email.trim(),
        typeof priority === 'string' ? priority : null,
        JSON.stringify(answers),
        JSON.stringify(report),
      ],
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Error al guardar diagnóstico:', err);
    res.status(500).json({ error: 'No se pudo guardar el diagnóstico.' });
  }
});

function safeCompare(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function requireAdmin(req, res, next) {
  const provided = req.header('x-admin-password') ?? '';
  const expected = process.env.ADMIN_PASSWORD ?? '';

  if (!expected || !safeCompare(provided, expected)) {
    return res.status(401).json({ error: 'No autorizado.' });
  }
  next();
}

app.get('/api/diagnostics', requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, company, email, priority, answers, report, created_at
       FROM diagnostics
       ORDER BY created_at DESC`,
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al leer diagnósticos:', err);
    res.status(500).json({ error: 'No se pudieron leer los diagnósticos.' });
  }
});

const port = process.env.PORT || 3001;

runMigrations()
  .then(() => {
    app.listen(port, () => {
      console.log(`Prisma Consultora API escuchando en el puerto ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error al aplicar migraciones al iniciar:', err);
    process.exit(1);
  });
