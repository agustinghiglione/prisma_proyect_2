import { X } from 'lucide-react';

interface LegalModalProps {
  onClose: () => void;
}

export default function LegalModal({ onClose }: LegalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/60 px-4 py-8 backdrop-blur-sm">
      <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-background p-8 shadow-soft sm:p-10">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-ink"
        >
          <X size={18} />
        </button>

        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Prisma Consultora</p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-ink">Privacidad y Términos</h2>
        <p className="mt-1 text-xs text-ink-soft">Vigente desde agosto de 2026</p>

        <div className="mt-7 flex flex-col gap-6 text-sm leading-relaxed text-ink-soft">
          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">Quiénes somos</h3>
            <p>
              Este sitio es operado por Prisma Consultora. Para cualquier consulta sobre estos
              términos o tus datos, escribinos a{' '}
              <a href="mailto:contacto@prismaconsultora.com" className="text-primary underline">
                contacto@prismaconsultora.com
              </a>
              .
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">Qué datos pedimos y para qué</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <strong className="text-ink">Diagnóstico Prisma® gratuito:</strong> tu nombre, el nombre de
                tu negocio si lo dejás, y tus respuestas a las preguntas del diagnóstico. No es
                obligatorio dejarnos un email en esta parte.
              </li>
              <li>
                <strong className="text-ink">Diagnóstico completo:</strong> tu email (para mandarte el
                informe) y, si querés, el link de tu sitio web.
              </li>
              <li>
                <strong className="text-ink">El pago:</strong> lo procesa Mercado Pago. Nosotros nunca
                vemos ni guardamos los datos de tu tarjeta — eso queda entre vos y Mercado Pago.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">Para qué usamos esos datos</h3>
            <p>
              Para armar y mandarte tu diagnóstico, para contactarte si nos pedís una conversación, y
              para mejorar el diagnóstico con el tiempo. No usamos tus respuestas para nada más, y no
              las cruzamos con otras fuentes.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">Con quién se comparten</h3>
            <p>
              Con nadie, salvo Mercado Pago para procesar el pago del diagnóstico completo. No
              vendemos ni cedemos tus datos a terceros, ni los usamos con fines publicitarios.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">Cookies y seguimiento</h3>
            <p>
              Este sitio no usa cookies de seguimiento ni herramientas de analítica de terceros. Lo
              único que se guarda es lo que vos mismo nos dejás al hacer el diagnóstico.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">
              Cuánto tiempo se guardan tus datos, y cómo pedís que los borremos
            </h3>
            <p>
              Guardamos tus respuestas mientras mantengamos una relación con vos (por ejemplo, para
              volver a mandarte tu informe si lo pedís). Podés pedirnos en cualquier momento que
              accedamos, corrijamos o borremos tus datos escribiendo a{' '}
              <a href="mailto:contacto@prismaconsultora.com" className="text-primary underline">
                contacto@prismaconsultora.com
              </a>
              . En Argentina, este derecho está amparado por la Ley 25.326 de Protección de Datos
              Personales, y la Agencia de Acceso a la Información Pública (AAIP) es el organismo de
              control ante el que también podés reclamar.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">Sobre el diagnóstico</h3>
            <p>
              El Diagnóstico Prisma® es una primera mirada automatizada sobre tu negocio, pensada para
              orientar, no para reemplazar un análisis profesional. Los resultados y las recomendaciones
              son orientativos: la conversación con nuestro equipo es la que arma la propuesta real para
              tu caso.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">Precios</h3>
            <p>
              El precio del diagnóstico completo es el que ves en pantalla al momento de pagar. Puede
              cambiar de un momento a otro, pero nunca después de que ya lo pagaste.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">Uso del sitio</h3>
            <p>
              Te pedimos que uses este sitio de buena fe: no intentes acceder a datos de otras personas
              ni interferir con su funcionamiento. El contenido (textos, diseño, el método Prisma®) es
              propiedad de Prisma Consultora.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
