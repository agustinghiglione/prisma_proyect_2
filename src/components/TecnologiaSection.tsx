import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Mail,
  Receipt,
  ScanSearch,
  Workflow,
} from 'lucide-react';

// Fotos: Unsplash (licencia libre de Unsplash). Se sirven desde su CDN.
const FOTO_WEB =
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=70';
const FOTO_ANALISIS =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=60';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INCLUYE_WEB = [
  'Diseño a medida, con tu marca',
  'Pensada para verse bien en el celular',
  'Botón de WhatsApp y formulario de contacto',
  'Nos ocupamos del hosting y de tu dominio',
];

/** Ejemplo de automatización: tres pasos que hoy alguien hace a mano. */
const EJEMPLO_FLUJO = [
  { icon: FileSpreadsheet, texto: 'Entra un pedido' },
  { icon: Receipt, texto: 'Se factura' },
  { icon: Mail, texto: 'Le llega al cliente' },
];

interface TecnologiaSectionProps {
  onConsultar: (contexto: string) => void;
}

/**
 * Servicios concretos del área de Tecnología: web a medida en 3 días,
 * análisis de una web existente (pedido por formulario, el informe se manda
 * por mail) y automatización de tareas repetitivas.
 */
export default function TecnologiaSection({ onConsultar }: TecnologiaSectionProps) {
  return (
    <section id="tecnologia" className="bg-sand px-6 pt-4 pb-20 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Tecnología para tu negocio
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary sm:text-4xl">
            Tu negocio, también en digital.
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Tres maneras concretas de que la tecnología trabaje para vos, no al revés.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* 1 · Web nueva en 3 días */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-soft lg:row-span-2"
          >
            <div className="relative h-56 shrink-0 sm:h-64 lg:h-auto lg:min-h-64 lg:flex-1">
              <img
                src={FOTO_WEB}
                alt="Diseño de una página web en una computadora portátil"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-primary-dark/10 to-transparent" />
              <span className="absolute bottom-5 left-6 flex items-baseline gap-1.5 rounded-2xl bg-gold px-4 py-2 font-heading text-primary-dark shadow-soft">
                <span className="text-3xl font-extrabold leading-none">3</span>
                <span className="text-sm font-bold">días</span>
              </span>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <h3 className="font-heading text-2xl font-bold text-ink">
                ¿No tenés página web? Te la hacemos en 3 días.
              </h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Desde la primera reunión, en tres días tu negocio tiene su web publicada: lista para
                que te encuentren, te conozcan y te escriban.
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {INCLUYE_WEB.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                    <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-green" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onConsultar('Quiero una página web para mi negocio: ')}
                className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Quiero mi página web <ArrowRight size={16} />
              </button>
            </div>
          </motion.article>

          {/* 2 · Análisis de una web existente */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark to-primary p-7 text-white shadow-soft sm:p-9"
          >
            <img
              src={FOTO_ANALISIS}
              alt=""
              aria-hidden
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.10] mix-blend-luminosity"
            />
            <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
            <div className="relative">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/20 text-gold">
                <ScanSearch size={20} strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 font-heading text-2xl font-bold text-white">
                ¿Ya tenés web, pero no te convence?
              </h3>
              <p className="mt-3 leading-relaxed text-white/80">
                Pegá el link y te mandamos por mail un informe con lo que conviene mejorar y cómo lo
                resolvemos. Sin costo.
              </p>
              <FormularioAnalisis />
            </div>
          </motion.article>

          {/* 3 · Automatización */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-border bg-white p-7 shadow-soft sm:p-9"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Workflow size={20} strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 font-heading text-2xl font-bold text-ink">
              ¿Tareas repetitivas que te quitan tiempo?
            </h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Concentrate en lo que de verdad te importa. Lo que se repite todos los días lo
              automatizamos nosotros.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl bg-sand/70 p-3">
              {EJEMPLO_FLUJO.map(({ icon: Icon, texto }, i) => (
                <span key={texto} className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink">
                    <Icon size={14} className="text-primary" strokeWidth={1.75} />
                    {texto}
                  </span>
                  {i < EJEMPLO_FLUJO.length - 1 && <ArrowRight size={14} className="text-gold" />}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-soft">Un ejemplo: todo eso, sin que nadie lo haga a mano.</p>

            <button
              onClick={() => onConsultar('Quiero automatizar esta tarea: ')}
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              Contanos qué tarea <ArrowRight size={16} />
            </button>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

function FormularioAnalisis() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [sitio, setSitio] = useState(''); // campo trampa para bots
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return setError('Pegá el link de tu página.');
    if (!EMAIL_RE.test(email.trim())) return setError('Ingresá un email válido.');

    setEnviando(true);
    setError('');
    try {
      const res = await fetch('/api/auditoria-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email, sitio }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'No pudimos enviar el pedido. Probá de nuevo.');
      setEnviado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos enviar el pedido. Probá de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-gold" />
        <p className="text-sm leading-relaxed text-white/90">
          ¡Listo! Recibimos tu web. Te mandamos el informe a <strong>{email.trim()}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="mt-6 grid gap-3" noValidate>
      <label className="sr-only" htmlFor="analisis-url">Link de tu página web</label>
      <input
        id="analisis-url"
        type="text"
        inputMode="url"
        autoComplete="url"
        placeholder="tunegocio.com.ar"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-xl border border-white/20 bg-white/95 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="analisis-email">Tu email</label>
        <input
          id="analisis-email"
          type="email"
          autoComplete="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full flex-1 rounded-xl border border-white/20 bg-white/95 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        <button
          type="submit"
          disabled={enviando}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-primary-dark transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {enviando ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          Analizar mi web
        </button>
      </div>
      {/* Campo trampa: oculto para personas */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={sitio}
        onChange={(e) => setSitio(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      {error && <p className="text-sm text-gold">{error}</p>}
      <p className="text-xs text-white/60">Usamos tu mail solo para mandarte el informe.</p>
    </form>
  );
}
