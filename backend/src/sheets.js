import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SHEET_NAME = process.env.GOOGLE_SHEET_TAB || 'Sheet1';
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Los nombres de pestaña con espacios o acentos deben ir entre comillas
// simples en la notación A1 (ej: 'Diagnósticos Prisma'!A2:A).
const QUOTED_SHEET_NAME = `'${SHEET_NAME.replace(/'/g, "''")}'`;

function loadCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_B64) {
    const json = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8');
    return JSON.parse(json);
  }

  // Desarrollo local: busca el primer archivo .json de credenciales en backend/.
  const localKeyFile = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
  if (localKeyFile) {
    return JSON.parse(readFileSync(path.join(__dirname, '..', localKeyFile), 'utf8'));
  }

  throw new Error(
    'Faltan las credenciales de Google. Definí GOOGLE_SERVICE_ACCOUNT_B64 (producción) o GOOGLE_SERVICE_ACCOUNT_FILE (local).',
  );
}

let sheetsClientPromise = null;

function getSheetsClient() {
  if (!sheetsClientPromise) {
    const credentials = loadCredentials();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    sheetsClientPromise = auth.getClient().then((authClient) => google.sheets({ version: 'v4', auth: authClient }));
  }
  return sheetsClientPromise;
}

export async function appendDiagnosticRow(row) {
  if (!SPREADSHEET_ID) {
    throw new Error('Falta GOOGLE_SHEET_ID.');
  }

  const sheets = await getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${QUOTED_SHEET_NAME}!A:A`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
}

export async function countExistingRows() {
  if (!SPREADSHEET_ID) {
    throw new Error('Falta GOOGLE_SHEET_ID.');
  }

  const sheets = await getSheetsClient();
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${QUOTED_SHEET_NAME}!A2:A`,
  });
  return data.values ? data.values.length : 0;
}
