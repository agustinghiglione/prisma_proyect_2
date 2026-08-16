// Se importa primero que nada en index.ts (antes de cualquier otro módulo
// del servidor). En ESM los imports de un archivo se resuelven en orden antes
// de que corra el cuerpo propio del archivo — así que si esto no fuera el
// primer import, otros módulos (como mercadopago.ts) leerían process.env
// *antes* de que dotenv lo haya cargado, y verían todo vacío.
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
