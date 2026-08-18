import { X } from 'lucide-react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { SCROLL_PANEL, SCROLL_PANEL_STYLE } from '../lib/ui';

interface LegalModalProps {
  onClose: () => void;
}

export default function LegalModal({ onClose }: LegalModalProps) {
  useBodyScrollLock();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/60 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-background p-8 shadow-soft sm:p-10 ${SCROLL_PANEL}`}
        style={SCROLL_PANEL_STYLE}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-ink"
        >
          <X size={18} />
        </button>

        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Prisma Consultora</p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-ink">
          Términos y Condiciones de Uso y Política de Privacidad
        </h2>
        <p className="mt-1 text-xs text-ink-soft">Última actualización: agosto de 2026</p>

        <div className="mt-7 flex flex-col gap-6 text-sm leading-relaxed text-ink-soft">
          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">1. Objeto y aceptación</h3>
            <p>
              El presente documento (en adelante, los "Términos") regula el acceso y uso del sitio web
              de Prisma Consultora (en adelante, el "Sitio") y de los servicios que a través de él se
              ofrecen, incluido el Diagnóstico Prisma® en sus modalidades gratuita y paga (en adelante,
              el "Servicio"). El acceso y la utilización del Sitio atribuyen la condición de usuario (en
              adelante, el "Usuario") e implican la aceptación plena de estos Términos. Si el Usuario no
              está de acuerdo con alguna de sus disposiciones, deberá abstenerse de utilizar el Sitio.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">2. Responsable</h3>
            <p>
              El responsable del Sitio y del tratamiento de los datos personales que en él se recaban es
              Prisma Consultora, con domicilio de contacto electrónico en{' '}
              <a href="mailto:contacto@prismaconsultora.com" className="text-primary underline">
                contacto@prismaconsultora.com
              </a>
              , dirección que el Usuario podrá utilizar para efectuar cualquier consulta, reclamo o
              ejercicio de derechos vinculado a estos Términos.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">
              3. Datos personales que se recaban
            </h3>
            <p>Según la instancia del Servicio en la que el Usuario participe, Prisma Consultora recaba:</p>
            <ul className="mt-2 flex flex-col gap-2">
              <li>
                <strong className="text-ink">Diagnóstico Prisma® gratuito:</strong> nombre, y — de manera
                opcional — el nombre del negocio del Usuario, junto con las respuestas provistas al
                cuestionario. El correo electrónico no es un dato obligatorio en esta instancia.
              </li>
              <li>
                <strong className="text-ink">Diagnóstico Prisma® completo:</strong> correo electrónico,
                necesario para la remisión del informe, y — de manera opcional — la dirección web del
                negocio del Usuario, junto con las respuestas al cuestionario ampliado.
              </li>
              <li>
                <strong className="text-ink">Procesamiento de pagos:</strong> los datos de la tarjeta o
                medio de pago son recabados y procesados exclusivamente por Mercado Pago S.R.L. Prisma
                Consultora no accede, recibe ni almacena en ningún momento esa información.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">4. Finalidad del tratamiento</h3>
            <p>
              Los datos recabados se utilizan exclusivamente para: (i) elaborar y remitir al Usuario el
              resultado del diagnóstico solicitado; (ii) gestionar el pago del diagnóstico completo,
              cuando corresponda; (iii) responder a solicitudes de contacto o de una primera
              conversación; y (iv) mejorar la calidad y precisión del Servicio. Prisma Consultora no
              utiliza los datos del Usuario con fines publicitarios ni los somete a decisiones
              automatizadas que produzcan efectos jurídicos sobre él.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">
              5. Comunicación de datos a terceros
            </h3>
            <p>
              Prisma Consultora no vende, cede ni comparte los datos personales del Usuario con
              terceros, con la única excepción de Mercado Pago, en la medida estrictamente necesaria
              para procesar el pago del diagnóstico completo. Dicho tercero cuenta con su propia
              política de privacidad, que resulta de aplicación al tratamiento que realiza de los datos
              de pago.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">6. Conservación de los datos</h3>
            <p>
              Los datos personales se conservan durante el tiempo necesario para cumplir con las
              finalidades descriptas en la Sección 4, y en tanto subsista una relación entre el Usuario y
              Prisma Consultora, o hasta que el Usuario ejerza su derecho de supresión conforme a la
              Sección 7.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">
              7. Derechos del Usuario sobre sus datos personales
            </h3>
            <p>
              De conformidad con la Ley N.º 25.326 de Protección de Datos Personales de la República
              Argentina, el Usuario tiene derecho a acceder, rectificar, actualizar y solicitar la
              supresión de sus datos personales, así como a oponerse a su tratamiento, dirigiendo su
              solicitud a{' '}
              <a href="mailto:contacto@prismaconsultora.com" className="text-primary underline">
                contacto@prismaconsultora.com
              </a>
              . La Agencia de Acceso a la Información Pública (AAIP), en su carácter de Órgano de
              Control de la Ley N.º 25.326, es la autoridad ante la cual el titular de los datos puede
              presentar reclamos vinculados al tratamiento de su información personal.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">8. Seguridad de la información</h3>
            <p>
              Prisma Consultora adopta medidas técnicas y organizativas razonables para proteger los
              datos personales del Usuario frente al acceso no autorizado, la pérdida o la alteración.
              No obstante, ningún sistema de transmisión o almacenamiento de datos es enteramente
              inviolable, por lo que no puede garantizarse una seguridad absoluta.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">
              9. Cookies y tecnologías de seguimiento
            </h3>
            <p>
              El Sitio no utiliza cookies de seguimiento ni herramientas de analítica de terceros. La
              totalidad de la información tratada es la que el Usuario provee voluntariamente al
              completar el diagnóstico.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">
              10. Naturaleza y alcance del Diagnóstico Prisma®
            </h3>
            <p>
              El Diagnóstico Prisma® constituye una herramienta orientativa de autoevaluación, generada
              a partir de las respuestas provistas por el Usuario. Sus resultados y recomendaciones no
              constituyen asesoramiento profesional, contable, impositivo, legal ni financiero, y no
              reemplazan el análisis particularizado que Prisma Consultora pueda realizar en el marco de
              una conversación o propuesta concreta.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">11. Precios y pagos</h3>
            <p>
              El precio del diagnóstico completo es el que se exhibe en el Sitio al momento de
              iniciarse el pago, y puede ser modificado por Prisma Consultora sin aviso previo, sin que
              ello afecte a los pagos ya confirmados. El pago se procesa a través de Mercado Pago, bajo
              sus propios términos y condiciones.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">12. Propiedad intelectual</h3>
            <p>
              Los contenidos del Sitio — incluyendo textos, diseño, metodología y la marca "Diagnóstico
              Prisma®" — son propiedad de Prisma Consultora y se encuentran protegidos por la normativa
              vigente en materia de propiedad intelectual. Queda prohibida su reproducción total o
              parcial sin autorización expresa.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">13. Limitación de responsabilidad</h3>
            <p>
              Prisma Consultora no será responsable por daños o perjuicios derivados de decisiones
              adoptadas por el Usuario con base exclusiva en los resultados del diagnóstico, ni por
              interrupciones temporales del Servicio derivadas de causas ajenas a su control razonable.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">14. Modificaciones</h3>
            <p>
              Prisma Consultora podrá modificar estos Términos en cualquier momento. La versión vigente
              será siempre la publicada en el Sitio, indicándose la fecha de su última actualización en
              el encabezado de este documento.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">15. Ley aplicable y jurisdicción</h3>
            <p>
              Estos Términos se rigen por las leyes de la República Argentina. Para cualquier
              controversia derivada de su interpretación o aplicación, las partes se someten a la
              jurisdicción de los tribunales ordinarios competentes, sin perjuicio de los fueros que
              pudieran corresponder al Usuario en su carácter de consumidor.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-heading text-base font-bold text-ink">16. Contacto</h3>
            <p>
              Ante cualquier consulta sobre estos Términos o sobre el tratamiento de sus datos
              personales, el Usuario puede escribir a{' '}
              <a href="mailto:contacto@prismaconsultora.com" className="text-primary underline">
                contacto@prismaconsultora.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
