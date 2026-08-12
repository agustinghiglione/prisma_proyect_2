import { Linkedin, Instagram, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

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
            <a href="#" aria-label="WhatsApp" className="hover:text-white">
              <MessageCircle size={18} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <Linkedin size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:justify-between">
        <p className="text-white/40">© {year} Prisma Consultora. Todos los derechos reservados.</p>
        <div className="flex gap-5">
          <a href="#" className="hover:text-white">
            Política de privacidad
          </a>
          <a href="#" className="hover:text-white">
            Términos
          </a>
        </div>
      </div>
    </footer>
  );
}
