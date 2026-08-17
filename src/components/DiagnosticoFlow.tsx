import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Lock, CheckCircle2, Loader2, Mail, ShieldCheck, Users } from 'lucide-react';
import {
  DIMENSIONES,
  DIMENSIONES_PARTE2,
  RECOMENDACIONES,
  RECOMENDACIONES_TODAS,
  QUE_INCLUYE_COMPLETO,
  nivelDe,
  PRECIO_DIAGNOSTICO_COMPLETO,
  type ResultadoDiagnostico,
  type ResultadoCompleto,
} from '../lib/diagnostico';

type Paso =
  | 'preguntas'
  | 'contacto'
  | 'resultado'
  | 'contacto-pago'
  | 'pago'
  | 'preguntas-2'
  | 'informe-completo';

interface DiagnosticoFlowProps {
  onClose: () => void;
}

const formatoARS = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// El azul reconocible de Mercado Pago — para que se sienta la marca sin
// necesitar su logo (que tiene su propia licencia de uso).
const MP_AZUL = '#009EE3';

export default function DiagnosticoFlow({ onClose }: DiagnosticoFlowProps) {
  const [paso, setPaso] = useState<Paso>('preguntas');
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>([]);

  const [nombre, setNombre] = useState('');
  const [negocio, setNegocio] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const [diagnosticoId, setDiagnosticoId] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoDiagnostico | null>(null);

  // Contacto para el diagnóstico completo (mail obligatorio, web opcional)
  const [emailPago, setEmailPago] = useState('');
  const [webUrl, setWebUrl] = useState('');

  const [qr, setQr] = useState<{ qrDataUrl: string; initPoint: string } | null>(null);
  const [pagado, setPagado] = useState(false);
  const [creandoPago, setCreandoPago] = useState(false);

  // Parte 2 — se desbloquea después de pagar
  const [preguntaActual2, setPreguntaActual2] = useState(0);
  const [respuestas2, setRespuestas2] = useState<number[]>([]);
  const [enviandoParte2, setEnviandoParte2] = useState(false);
  const [resultadoCompleto, setResultadoCompleto] = useState<ResultadoCompleto | null>(null);

  // Prueba social: cuántos diagnósticos se hicieron en total (dato real, no fijo)
  const [totalDiagnosticos, setTotalDiagnosticos] = useState<number | null>(null);
  useEffect(() => {
    fetch('/api/estadisticas')
      .then((r) => r.json())
      .then((d) => setTotalDiagnosticos(d.total))
      .catch(() => {});
  }, []);

  const elegirOpcion = (valor: number) => {
    const nuevas = [...respuestas, valor];
    setRespuestas(nuevas);
    if (preguntaActual + 1 < DIMENSIONES.length) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      setPaso('contacto');
    }
  };

  const verResultado = async () => {
    if (!nombre.trim()) {
      setError('Necesitamos tu nombre para el informe.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, negocio, respuestas }),
      });
      if (!res.ok) throw new Error('No se pudo guardar el diagnóstico.');
      const data = await res.json();
      setDiagnosticoId(data.id);
      setResultado(data.resultado);
      setPaso('resultado');
    } catch {
      setError('Algo falló al guardar tu diagnóstico. Probá de nuevo en un momento.');
    } finally {
      setEnviando(false);
    }
  };

  const pedirDiagnosticoCompleto = () => {
    setPaso('contacto-pago');
  };

  const confirmarYPagar = async () => {
    if (!diagnosticoId) return;
    if (!EMAIL_RE.test(emailPago)) {
      setError('Ingresá un email válido para recibir el diagnóstico completo.');
      return;
    }
    setCreandoPago(true);
    setError('');
    try {
      const res = await fetch(`/api/diagnostico/${diagnosticoId}/pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailPago, webUrl: webUrl || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'No se pudo iniciar el pago.');
      }
      const data = await res.json();
      setQr(data);
      setPaso('pago');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos iniciar el pago. Probá de nuevo en un momento.');
    } finally {
      setCreandoPago(false);
    }
  };

  // Mientras se muestra el QR, se consulta cada 4s si el pago ya se confirmó.
  // Al confirmarse, se pasa directo a la Parte 2 (o al informe si ya estaba hecha).
  useEffect(() => {
    if (paso !== 'pago' || !diagnosticoId || pagado) return;
    const intervalo = setInterval(async () => {
      const res = await fetch(`/api/diagnostico/${diagnosticoId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.estado === 'pagado') {
        setPagado(true);
        if (data.parte2Completa) {
          setResultadoCompleto(data.resultadoCompleto);
          setPaso('informe-completo');
        } else {
          setPaso('preguntas-2');
        }
      }
    }, 4000);
    return () => clearInterval(intervalo);
  }, [paso, diagnosticoId, pagado]);

  const elegirOpcion2 = (valor: number) => {
    const nuevas = [...respuestas2, valor];
    setRespuestas2(nuevas);
    if (preguntaActual2 + 1 < DIMENSIONES_PARTE2.length) {
      setPreguntaActual2(preguntaActual2 + 1);
    } else {
      enviarParte2(nuevas);
    }
  };

  const enviarParte2 = async (respuestasFinales: number[]) => {
    if (!diagnosticoId) return;
    setEnviandoParte2(true);
    setError('');
    try {
      const res = await fetch(`/api/diagnostico/${diagnosticoId}/parte-2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respuestas: respuestasFinales }),
      });
      if (!res.ok) throw new Error('No se pudo guardar la segunda parte.');
      const data = await res.json();
      setResultadoCompleto(data.resultadoCompleto);
      setPaso('informe-completo');
    } catch {
      setError('Algo falló al guardar tus respuestas. Probá de nuevo en un momento.');
    } finally {
      setEnviandoParte2(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/60 px-4 py-8 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-background p-8 shadow-soft sm:p-10"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-ink"
        >
          <X size={18} />
        </button>

        <AnimatePresence mode="wait">
          {paso === 'preguntas' && (
            <motion.div key="preguntas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {preguntaActual === 0 && totalDiagnosticos !== null && totalDiagnosticos > 0 && (
                <p className="mb-5 flex items-center gap-1.5 text-xs text-ink-soft">
                  <Users size={13} className="text-primary" />
                  Ya lo hicieron {totalDiagnosticos} {totalDiagnosticos === 1 ? 'negocio' : 'negocios'}
                </p>
              )}
              <div className="mb-6 flex gap-1.5">
                {DIMENSIONES.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${i <= preguntaActual ? 'bg-gold' : 'bg-surface'}`}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Pregunta {preguntaActual + 1} de {DIMENSIONES.length}
              </p>
              <h3 className="mt-3 font-heading text-2xl font-bold text-ink">
                {DIMENSIONES[preguntaActual].pregunta}
              </h3>
              <div className="mt-7 flex flex-col gap-3">
                {DIMENSIONES[preguntaActual].opciones.map((op) => (
                  <button
                    key={op.texto}
                    onClick={() => elegirOpcion(op.valor)}
                    className="rounded-2xl border border-border bg-white px-5 py-4 text-left text-sm text-ink transition-colors hover:border-primary hover:bg-surface/40"
                  >
                    {op.texto}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {paso === 'contacto' && (
            <motion.div key="contacto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="font-heading text-2xl font-bold text-ink">Ya casi está.</h3>
              <p className="mt-2 text-sm text-ink-soft">Un último paso antes de ver tu resultado.</p>
              <div className="mt-6 flex flex-col gap-4">
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
                <input
                  value={negocio}
                  onChange={(e) => setNegocio(e.target.value)}
                  placeholder="Tu negocio (opcional)"
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  onClick={verResultado}
                  disabled={enviando}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {enviando ? <Loader2 size={16} className="animate-spin" /> : null}
                  Ver mi resultado
                </button>
              </div>
            </motion.div>
          )}

          {paso === 'resultado' && resultado && (
            <motion.div key="resultado" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Tu Diagnóstico Prisma®
              </p>
              <h3 className="mt-2 font-heading text-2xl font-bold text-ink">
                Nivel general de claridad: {resultado.overallPercent}%
              </h3>

              <div className="mt-6 flex flex-col gap-3">
                {resultado.fortalezas.length > 0 ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-green" />
                    <p className="text-sm text-ink">
                      En <strong>{resultado.fortalezas[0].dimension}</strong> estás bien encaminado.{' '}
                      {RECOMENDACIONES[resultado.fortalezas[0].dimension][nivelDe(resultado.fortalezas[0].valor)]}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
                    <p className="text-sm text-ink">
                      Tu punto de partida más fuerte hoy es <strong>{resultado.scores[0].dimension}</strong>,
                      aunque todavía tiene camino por recorrer.
                    </p>
                  </div>
                )}

                {resultado.oportunidades.length > 0 ? (
                  resultado.oportunidades.slice(0, 2).map((o) => (
                    <div key={o.dimension} className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4">
                      <Lock size={18} className="mt-0.5 shrink-0 text-primary-dark" />
                      <p className="text-sm text-ink-soft">
                        Detectamos una oportunidad en <strong className="text-ink">{o.dimension}</strong> que
                        podría estar costándote más de lo que pensás.
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-3 rounded-2xl border border-green/30 bg-green/10 p-4">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green" />
                    <p className="text-sm text-ink-soft">
                      Las 5 áreas que medimos hoy están sólidas. El diagnóstico completo mira otras 6 que
                      todavía no tocamos acá.
                    </p>
                  </div>
                )}
              </div>

              {/* El envío por mail es parte del diagnóstico completo — esto solo llama la atención hacia eso */}
              <button
                onClick={pedirDiagnosticoCompleto}
                className="mt-5 flex w-full items-center gap-2 rounded-2xl border border-border bg-white p-4 text-left transition-colors hover:border-primary hover:bg-surface/40"
              >
                <Mail size={18} className="shrink-0 text-primary" />
                <span className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink">Mandarme este resultado por mail</span> — es parte
                  del diagnóstico completo.
                </span>
              </button>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              {/* Qué incluye el diagnóstico completo — para que sepa qué está comprando */}
              <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Qué incluye el diagnóstico completo
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {QUE_INCLUYE_COMPLETO.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={pedirDiagnosticoCompleto}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-primary-dark shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Ver mi diagnóstico completo — {formatoARS.format(PRECIO_DIAGNOSTICO_COMPLETO)}
                <ArrowRight size={16} />
              </button>
              {totalDiagnosticos !== null && totalDiagnosticos > 0 && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-soft">
                  <Users size={12} /> {totalDiagnosticos} {totalDiagnosticos === 1 ? 'negocio ya lo hizo' : 'negocios ya lo hicieron'}
                </p>
              )}
            </motion.div>
          )}

          {paso === 'contacto-pago' && (
            <motion.div key="contacto-pago" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="font-heading text-2xl font-bold text-ink">Tu diagnóstico completo</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Después de pagar vas a responder algunas preguntas más y vas a poder dejarnos el link de tu web.
              </p>
              <div className="mt-6 flex flex-col gap-4">
                <input
                  value={emailPago}
                  onChange={(e) => setEmailPago(e.target.value)}
                  type="email"
                  placeholder="Tu email"
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
                <input
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  placeholder="El link de tu web (opcional)"
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  onClick={confirmarYPagar}
                  disabled={creandoPago}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-primary-dark shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {creandoPago ? <Loader2 size={16} className="animate-spin" /> : null}
                  Continuar al pago — {formatoARS.format(PRECIO_DIAGNOSTICO_COMPLETO)}
                </button>
              </div>
            </motion.div>
          )}

          {paso === 'pago' && qr && (
            <motion.div key="pago" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="font-heading text-2xl font-bold text-ink">Escaneá para pagar</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Con la cámara de tu celular, o tocá el botón si ya estás en tu celu.
              </p>
              <div className="mt-6 flex justify-center">
                <img src={qr.qrDataUrl} alt="Código QR para pagar con Mercado Pago" className="h-56 w-56 rounded-2xl border border-border" />
              </div>
              <a
                href={qr.initPoint}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: MP_AZUL }}
              >
                Pagar con Mercado Pago <ArrowRight size={16} />
              </a>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs" style={{ color: MP_AZUL }}>
                <ShieldCheck size={14} /> Pago procesado de forma segura por Mercado Pago
              </p>
              <p className="mt-5 flex items-center justify-center gap-2 text-xs text-ink-soft">
                <Loader2 size={14} className="animate-spin" /> Esperando la confirmación del pago…
              </p>
            </motion.div>
          )}

          {paso === 'preguntas-2' && (
            <motion.div key="preguntas-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green">
                <CheckCircle2 size={14} /> Pago confirmado
              </p>
              <div className="mb-6 mt-4 flex gap-1.5">
                {DIMENSIONES_PARTE2.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${i <= preguntaActual2 ? 'bg-gold' : 'bg-surface'}`}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Pregunta {preguntaActual2 + 1} de {DIMENSIONES_PARTE2.length}
              </p>
              <h3 className="mt-3 font-heading text-2xl font-bold text-ink">
                {DIMENSIONES_PARTE2[preguntaActual2].pregunta}
              </h3>
              <div className="mt-7 flex flex-col gap-3">
                {enviandoParte2 ? (
                  <p className="flex items-center justify-center gap-2 py-6 text-sm text-ink-soft">
                    <Loader2 size={16} className="animate-spin" /> Armando tu diagnóstico completo…
                  </p>
                ) : (
                  DIMENSIONES_PARTE2[preguntaActual2].opciones.map((op) => (
                    <button
                      key={op.texto}
                      onClick={() => elegirOpcion2(op.valor)}
                      className="rounded-2xl border border-border bg-white px-5 py-4 text-left text-sm text-ink transition-colors hover:border-primary hover:bg-surface/40"
                    >
                      {op.texto}
                    </button>
                  ))
                )}
              </div>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </motion.div>
          )}

          {paso === 'informe-completo' && resultadoCompleto && (
            <motion.div key="informe-completo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Tu Diagnóstico Prisma® completo
              </p>
              <h3 className="mt-2 font-heading text-2xl font-bold text-ink">
                Nivel general de claridad: {resultadoCompleto.overallPercent}%
              </h3>
              <div className="mt-6 flex flex-col gap-3">
                {resultadoCompleto.todos.map((s) => (
                  <div key={s.dimension} className="rounded-2xl border border-border bg-white p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink">{s.dimension}</span>
                      <span className="text-ink-soft">{Math.round((s.valor / 4) * 100)}%</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">
                      {RECOMENDACIONES_TODAS[s.dimension][nivelDe(s.valor)]}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-sm text-ink-soft">
                También te lo mandamos por mail. El siguiente paso es conversar sobre cómo implementarlo.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
