import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { LeadInfo } from '../../hooks/useDiagnostic';

interface LeadFormScreenProps {
  onSubmit: (info: LeadInfo) => void;
  onBack: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LeadFormScreen({ onSubmit, onBack }: LeadFormScreenProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  const isValid = name.trim().length > 1 && company.trim().length > 1 && EMAIL_RE.test(email);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit({ name: name.trim(), company: company.trim(), email: email.trim() });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg"
    >
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-ink-soft transition-colors hover:text-primary"
      >
        <ChevronLeft size={16} /> Volver
      </button>

      <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
        Ya casi está. ¿A quién preparamos el informe?
      </h2>
      <p className="mt-2 text-ink-soft">Usamos estos datos únicamente para personalizar tu Informe Ejecutivo Prisma®.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-primary"
          />
          {touched && name.trim().length <= 1 && (
            <p className="mt-1 text-xs text-red-500">Ingresá tu nombre.</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Empresa</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Nombre de tu empresa"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-primary"
          />
          {touched && company.trim().length <= 1 && (
            <p className="mt-1 text-xs text-red-500">Ingresá el nombre de tu empresa.</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@empresa.com"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-primary"
          />
          {touched && !EMAIL_RE.test(email) && (
            <p className="mt-1 text-xs text-red-500">Ingresá un email válido.</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Ver mi Informe Ejecutivo
        </button>
      </form>
    </motion.div>
  );
}
