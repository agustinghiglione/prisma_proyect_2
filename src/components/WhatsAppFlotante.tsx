import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '../data/contacto';

/** Botón flotante de WhatsApp. No se muestra hasta que haya número cargado en src/data/contacto.ts. */
export default function WhatsAppFlotante() {
  const url = whatsappUrl();
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-soft transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle size={26} />
    </a>
  );
}
