import { useRef, useState } from 'react';
import { Linkedin, Instagram, Mail, MessageCircle } from 'lucide-react';
import LegalModal from './LegalModal';

export default function Footer() {
  const year = new Date().getFullYear();
  const [legalAbierto, setLegalAbierto] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const avisarProximamente = (nombre: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast(`${nombre} no está disponible todavía — estamos trabajando en ella.`);
    toastTimeout.current = setTimeout(() => setToast(null), 3500);
  };

  return (
    <footer className="bg-gradient-prisma px-6 py-12 text-white/70 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading text-lg font-extrabold text-white">
            PRISMA <span className="font-medium text-white/70">CONSULTORA</span>
          </p>
          <p className="mt-1 text-sm">Claridad para crecer.</p>
        </div>

        <div className="flex flex-col items-center gap-2 text-sm sm:items-end">
          <a href="mailto:contacto@prismaconsultora.com" className="flex items-center gap-2 hover:text-white">
            <Mail size={15} /> contacto@prismaconsultora.com
          </a>
          <div className="flex gap-4">
            <button onClick={() => avisarProximamente('WhatsApp')} aria-label="WhatsApp" className="hover:text-white">
              <MessageCircle size={18} />
            </button>
            <button onClick={() => avisarProximamente('LinkedIn')} aria-label="LinkedIn" className="hover:text-white">
              <Linkedin size={18} />
            </button>
            <button onClick={() => avisarProximamente('Instagram')} aria-label="Instagram" className="hover:text-white">
              <Instagram size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:justify-between">
        <p className="text-white/40">© {year} Prisma Consultora. Todos los derechos reservados.</p>
        <button onClick={() => setLegalAbierto(true)} className="hover:text-white">
          Privacidad y Términos
        </button>
      </div>

      {legalAbierto && <LegalModal onClose={() => setLegalAbierto(false)} />}

      {toast && (
        <div className="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
          <div className="rounded-full bg-primary-dark px-5 py-3 text-sm text-white shadow-soft">{toast}</div>
        </div>
      )}
    </footer>
  );
}
