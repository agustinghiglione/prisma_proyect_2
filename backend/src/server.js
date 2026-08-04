import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { appendDiagnosticRow, countExistingRows } from './sheets.js';

const app = express();

app.use(express.json({ limit: '100kb' }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? '*',
  }),
);

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/diagnostics', async (req, res) => {
  const { name, company, email, answers, resultado, prioridades } = req.body ?? {};

  const answersValid = Array.isArray(answers) && answers.length === 6 && answers.every((a) => typeof a === 'string');
  const prioridadesValid =
    Array.isArray(prioridades) && prioridades.length === 3 && prioridades.every((p) => typeof p === 'string');

  if (
    typeof name !== 'string' ||
    typeof company !== 'string' ||
    typeof email !== 'string' ||
    !name.trim() ||
    !company.trim() ||
    !EMAIL_RE.test(email) ||
    !answersValid ||
    typeof resultado !== 'string' ||
    !prioridadesValid
  ) {
    return res.status(400).json({ error: 'Datos de diagnóstico inválidos.' });
  }

  try {
    const nextId = (await countExistingRows()) + 1;
    const fecha = new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });

    await appendDiagnosticRow([
      nextId,
      fecha,
      name.trim(),
      company.trim(),
      email.trim(),
      ...answers,
      resultado,
      ...prioridades,
      '', // Informe enviado
      '', // Primera conversación
      '', // Cliente
      '', // Observaciones
    ]);

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Error al guardar diagnóstico en Google Sheets:', err);
    res.status(500).json({ error: 'No se pudo guardar el diagnóstico.' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Prisma Consultora API escuchando en el puerto ${port}`);
});
