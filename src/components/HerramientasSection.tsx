import { ArrowUpRight, FileUser, Gauge } from 'lucide-react';

interface HerramientasProps {
  onStartDiagnostic: () => void;
  onConsultar: (contexto: string) => void;
}

const URL_CV = 'https://tucvonline.com/?utm_source=consultoraprisma&utm_medium=web&utm_campaign=herramientas';

export default function HerramientasSection({ onStartDiagnostic, onConsultar }: HerramientasProps) {
  return (
    <section id="herramientas" className="bg-background px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Herramientas Prisma</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary sm:text-4xl">
            Soluciones que construimos y ya podés usar.
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Son desarrollos del área de Tecnología de Consultora Prisma. Lo mismo que hacemos para
            nosotros lo podemos hacer para tu negocio.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-border bg-white p-7 shadow-soft">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Gauge size={20} strokeWidth={1.75} />
            </span>
            <p className="mt-4 font-heading text-lg font-bold text-ink">Diagnóstico Prisma®</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
              Cinco preguntas y en menos de un minuto tenés una primera lectura de tu negocio, área
              por área. Gratis.
            </p>
            <button
              onClick={onStartDiagnostic}
              className="mt-6 self-start rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Hacer el diagnóstico
            </button>
          </div>

          <div className="flex flex-col rounded-2xl border border-border bg-white p-7 shadow-soft">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-primary-dark">
              <FileUser size={20} strokeWidth={1.75} />
            </span>
            <p className="mt-4 font-heading text-lg font-bold text-ink">tucvonline.com</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
              Tu CV profesional en una sola hoja. Cargás tus datos una vez, elegís entre 8 plantillas
              y lo descargás en PDF o JPG. Registro sin costo; pagás solo cuando descargás.
            </p>
            <a
              href={URL_CV}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 self-start rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              Armar mi CV <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <button
          onClick={() => onConsultar('Quiero una herramienta digital para mi negocio: ')}
          className="mt-8 text-sm font-semibold text-primary underline decoration-gold decoration-2 underline-offset-4"
        >
          ¿Necesitás una herramienta así para tu negocio? Contanos tu idea.
        </button>
      </div>
    </section>
  );
}
