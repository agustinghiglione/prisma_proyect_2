import { Linkedin, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary-dark px-6 py-12 text-white/70 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading text-lg font-extrabold text-white">
            PRISMA <span className="font-medium text-secondary">CONSULTORA</span>
          </p>
          <p className="mt-1 text-sm">Claridad para crecer.</p>
        </div>

        <div className="flex flex-col items-center gap-2 text-sm sm:items-end">
          <a href="mailto:contacto@prismaconsultora.com" className="flex items-center gap-2 hover:text-white">
            <Mail size={15} /> contacto@prismaconsultora.com
          </a>
          <div className="flex gap-4">
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <Linkedin size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-white/40">
        © {year} Prisma Consultora. Todos los derechos reservados.
      </p>
    </footer>
  );
}
