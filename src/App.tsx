import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuienesSomosSection from './components/QuienesSomosSection';
import AreasSection from './components/AreasSection';
import TecnologiaSection from './components/TecnologiaSection';
import TransicionColor from './components/TransicionColor';
import ComoTrabajamosSection from './components/ComoTrabajamosSection';
import ContactoSection from './components/ContactoSection';
import PlanesSection from './components/PlanesSection';
import ConfianzaSection from './components/ConfianzaSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import WhatsAppFlotante from './components/WhatsAppFlotante';
import DiagnosticoFlow from './components/DiagnosticoFlow';
import AgendarModal from './components/AgendarModal';

// Ruta del cliente: entiendo qué es (hero + quiénes somos) → veo mi problema
// (áreas) → tecnología: web en 3 días, análisis de web y automatización →
// empiezo gratis (diagnóstico y primera conversación) → cómo
// trabajan → planes → confianza (+ tarjeta del CV) → preguntas.
// Fondo: arena continuo de Quiénes somos a Cómo empezar, degradé al azul de
// Cómo trabajamos, degradé de vuelta al arena en Planes y a marfil en Confianza.
// Secciones que ya no se usan (quedan por si se quieren recuperar):
// ProblemsSection, DiagnosticIntro, SolucionesSection, TransitionQuote,
// MetodoSection, PorQueSection, HerramientasSection, AudienciaSection.
function App() {
  const [diagnosticoAbierto, setDiagnosticoAbierto] = useState(false);
  const [consulta, setConsulta] = useState<string | null>(null);
  const openDiagnostic = () => setDiagnosticoAbierto(true);
  const openConsulta = (contexto = '') => setConsulta(contexto);

  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      <Navbar />
      <main>
        <Hero onStartDiagnostic={openDiagnostic} onConsultar={() => openConsulta()} />
        <QuienesSomosSection />
        <AreasSection onConsultar={openConsulta} />
        <TecnologiaSection onConsultar={openConsulta} />
        <ContactoSection onStartDiagnostic={openDiagnostic} />
        <TransicionColor variante="arena-a-azul" />
        <ComoTrabajamosSection />
        <TransicionColor variante="azul-a-arena" />
        <PlanesSection onConsultar={openConsulta} />
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
