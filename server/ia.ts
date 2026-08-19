import { sintesisRespaldo, type ResultadoCompleto } from '../src/lib/diagnostico';

const MODELO = 'gemini-2.0-flash';

/**
 * Arma la síntesis final que ve el cliente en el diagnóstico completo. Si hay
 * GEMINI_API_KEY configurada se la pide a Gemini (free tier, vía REST — sin
 * agregar el SDK completo por una sola llamada); si no hay clave, o si la
 * llamada falla por lo que sea, se usa el respaldo local. El cliente nunca
 * se queda sin síntesis.
 */
export async function generarSintesis(
  resultado: ResultadoCompleto,
  nombre: string,
  negocio?: string | null,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return sintesisRespaldo(resultado, nombre);

  const resumenAreas = resultado.todos
    .map((s) => `- ${s.dimension}: ${Math.round((s.valor / 4) * 100)}%`)
    .join('\n');

  const prompt = `Sos un consultor de negocios de Prisma Consultora (Argentina). Un cliente completó un autodiagnóstico de su negocio en seis áreas (Estrategia, Finanzas, Administración, Personas, Contabilidad e Impuestos, Tecnología). Estos son sus puntajes, de 0 a 100%:
${resumenAreas}

Nombre del cliente: ${nombre || 'sin nombre'}
Negocio: ${negocio || 'no especificado'}

Escribí una síntesis breve (máximo 3 frases, en español rioplatense, tono cercano y directo, sin sonar a IA genérica) que:
- No explique ni justifique cada respuesta una por una — el cliente ya ve sus puntajes en pantalla.
- Señale una o dos áreas concretas donde Prisma puede ayudar más, nombrándolas.
- Termine invitando a agendar una conversación, sin sonar a venta forzada.
Devolvé solo el texto corrido, sin markdown, sin viñetas, sin comillas.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 220 },
        }),
      },
    );
    if (!res.ok) throw new Error(`Gemini respondió ${res.status}`);
    const data = await res.json();
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!texto) throw new Error('Respuesta de Gemini sin texto utilizable');
    return texto;
  } catch (err) {
    console.error('[ia] no se pudo generar la síntesis con Gemini, uso el respaldo local:', err);
    return sintesisRespaldo(resultado, nombre);
  }
}
