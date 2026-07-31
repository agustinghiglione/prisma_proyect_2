import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', 'migrations');

async function run() {
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Aplicando migración: ${file}`);
    await pool.query(sql);
  }

  console.log('Migraciones aplicadas correctamente.');
  await pool.end();
}

run().catch((err) => {
  console.error('Error al migrar:', err);
  process.exit(1);
});
