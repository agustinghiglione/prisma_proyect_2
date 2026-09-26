import { AUDIENCIAS } from '../data/audiencias';

/** Versión compacta: solo los perfiles, para que cada visitante se reconozca de un vistazo. */
export default function AudienciaSection() {
  return (
    <section id="para-quien" className="bg-surface/50 px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
          Del primer emprendimiento a la empresa consolidada.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {AUDIENCIAS.map(({ icon: Icon, title }) => (
            <span
              key={title}
              className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm text-ink"
            >
              <Icon size={16} className="text-primary" strokeWidth={1.75} />
              {title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
