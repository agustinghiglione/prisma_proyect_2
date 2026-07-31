import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', 'migrations');

export async function runMigrations() {
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Aplicando migración: ${file}`);
    await pool.query(sql);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runMigrations()
    .then(() => {
      console.log('Migraciones aplicadas correctamente.');
      return pool.end();
    })
    .catch((err) => {
      console.error('Error al migrar:', err);
      process.exit(1);
    });
}
