import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuienesSomosSection from './components/QuienesSomosSection';
import ServiciosSection from './components/ServiciosSection';
import TecnologiaSection from './components/TecnologiaSection';
import TransicionColor from './components/TransicionColor';
import ComoTrabajamosSection from './components/ComoTrabajamosSection';
import ContactoSection from './components/ContactoSection';
import ArmaTuPrismaSection from './components/ArmaTuPrismaSection';
import ClientesSection from './components/ClientesSection';
import ConfianzaSection from './components/ConfianzaSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import WhatsAppFlotante from './components/WhatsAppFlotante';
import DiagnosticoFlow from './components/DiagnosticoFlow';
import AgendarModal from './components/AgendarModal';

// v6 — Ruta del cliente: hero (la consulta entra al prisma y sale en los seis
// módulos) → quiénes somos → servicios en tres bloques → cómo trabajamos
// (5 pasos) → destacados de tecnología → armá tu Prisma → la firma Prisma
// (cruces) → paquetes → cómo empezar (gratis) → clientes (solo aprobados) →
// confianza → preguntas.
// Secciones que ya no se usan (quedan por si se quieren recuperar):
// AreasSection, PlanesSection, CvTransicion, ProblemsSection, DiagnosticIntro,
// SolucionesSection, TransitionQuote, MetodoSection, PorQueSection,
// HerramientasSection, AudienciaSection.
function App() {
  const [diagnosticoAbierto, setDiagnosticoAbierto] = useState(false);
  const [consulta, setConsulta] = useState<string | null>(null);
  const openDiagnostic = () => setDiagnosticoAbierto(true);
  const openConsulta = (contexto = '') => setConsulta(contexto);

  // Enlaces con ancla (p. ej. desde las historias de Instagram: /#servicios):
  // la página se arma después de cargar, así que el navegador no llega a bajar
  // solo. Esperamos a que exista la sección y la mostramos.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      <Navbar />
      <main>
        <Hero onStartDiagnostic={openDiagnostic} onConsultar={() => openConsulta()} />
        <QuienesSomosSection />
        <ServiciosSection onConsultar={openConsulta} />
        <TransicionColor variante="arena-a-azul" />
        <ComoTrabajamosSection />
        <TransicionColor variante="azul-a-arena" />
        <TecnologiaSection onConsultar={openConsulta} />
        {/* Armá tu Prisma incluye, en este orden, la firma Prisma (cruces) y los paquetes */}
        <ArmaTuPrismaSection onConsultar={openConsulta} />
        <ContactoSection onStartDiagnostic={openDiagnostic} />
        <ClientesSection />
        <ConfianzaSection />
        <FaqSection />
      </main>
      <Footer />
      <WhatsAppFlotante />
      {diagnosticoAbierto && <DiagnosticoFlow onClose={() => setDiagnosticoAbierto(false)} />}
      {consulta !== null && (
        <AgendarModal contextoInicial={consulta} onClose={() => setConsulta(null)} />
      )}
    </div>
  );
}

export default App;
