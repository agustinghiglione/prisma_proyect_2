import { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

interface AgendarModalProps {
  onClose: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HIZO_DIAGNOSTICO = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
  { value: 'no_seguro', label: 'No estoy seguro' },
];

const HORARIOS = [
  { value: 'manana', label: 'Mañana' },
  { value: 'mediodia', label: 'Mediodía' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'cualquiera', label: 'Cualquier horario' },
];

export default function AgendarModal({ onClose }: AgendarModalProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [hizoDiagnostico, setHizoDiagnostico] = useState('');
  const [horario, setHorario] = useState('');
  const [contexto, setContexto] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  const enviar = async () => {
    if (!nombre.trim()) return setError('Falta tu nombre.');
    if (!EMAIL_RE.test(email)) return setError('Ingresá un email válido.');
    if (!hizoDiagnostico) return setError('Indicá si ya hiciste el diagnóstico.');
    if (!horario) return setError('Elegí un horario que te quede mejor.');

    setEnviando(true);
    setError('');
    try {
      const res = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, hizoDiagnostico, horario, contexto }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'No se pudo enviar.');
      }
      setEnviado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo falló. Probá de nuevo en un momento.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/60 px-4 py-8 backdrop-blur-sm">
      <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-background p-8 shadow-soft sm:p-10 [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:my-3 [&::-webkit-scrollbar-track]:bg-transparent">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-ink"
        >
          <X size={18} />
        </button>

        {!enviado ? (
          <>
            <h3 className="font-heading text-2xl font-bold text-ink">Agendemos una primera conversación</h3>
            <p className="mt-2 text-sm text-ink-soft">Sin costo, sin compromiso. Coordinamos por acá.</p>

            <div className="mt-6 flex flex-col gap-4">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Tu email"
                className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Teléfono / WhatsApp (opcional)"
                className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />

              <div>
                <p className="mb-2 text-sm font-semibold text-ink">¿Ya completaste el Diagnóstico Prisma®?</p>
                <div className="flex flex-wrap gap-2">
                  {HIZO_DIAGNOSTICO.map((op) => (
                    <button
                      key={op.value}
                      onClick={() => setHizoDiagnostico(op.value)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        hizoDiagnostico === op.value
                          ? 'border-primary bg-primary text-white'
                          : 'border-border bg-white text-ink hover:border-primary'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-ink">¿Qué horarios te quedan mejor?</p>
                <div className="flex flex-wrap gap-2">
                  {HORARIOS.map((op) => (
                    <button
                      key={op.value}
                      onClick={() => setHorario(op.value)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        horario === op.value
                          ? 'border-primary bg-primary text-white'
                          : 'border-border bg-white text-ink hover:border-primary'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                placeholder="Contanos brevemente en qué momento está tu negocio (opcional)"
                rows={3}
                className="resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                onClick={enviar}
                disabled={enviando}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {enviando ? <Loader2 size={16} className="animate-spin" /> : null}
                Enviar <ArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 size={40} className="text-green" />
            <h3 className="mt-4 font-heading text-2xl font-bold text-ink">¡Listo!</h3>
            <p className="mt-2 max-w-sm text-sm text-ink-soft">
              Recibimos tu pedido. Te vamos a escribir a {email} para coordinar el horario.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
