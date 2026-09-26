import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AreasSection from './components/AreasSection';
import ComoTrabajamosSection from './components/ComoTrabajamosSection';
import AudienciaSection from './components/AudienciaSection';
import PlanesSection from './components/PlanesSection';
import HerramientasSection from './components/HerramientasSection';
import ContactoSection from './components/ContactoSection';
import Footer from './components/Footer';
import DiagnosticoFlow from './components/DiagnosticoFlow';
import AgendarModal from './components/AgendarModal';

// Rediseño v2 (rama rediseno-v2): home más corta, centrada en la esencia —
// "una sola puerta, un profesional por área". Las secciones que salieron
// (ProblemsSection, DiagnosticIntro, SolucionesSection, TransitionQuote,
// MetodoSection, PorQueSection) siguen en src/components por si se quieren
// recuperar.
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
        <AreasSection onConsultar={openConsulta} />
        <ComoTrabajamosSection onStartDiagnostic={openDiagnostic} />
        <AudienciaSection />
        <PlanesSection />
        <HerramientasSection onStartDiagnostic={openDiagnostic} onConsultar={openConsulta} />
        <ContactoSection onStartDiagnostic={openDiagnostic} />
      </main>
      <Footer />
      {diagnosticoAbierto && <DiagnosticoFlow onClose={() => setDiagnosticoAbierto(false)} />}
      {consulta !== null && (
        <AgendarModal contextoInicial={consulta} onClose={() => setConsulta(null)} />
      )}
    </div>
  );
}

export default App;
