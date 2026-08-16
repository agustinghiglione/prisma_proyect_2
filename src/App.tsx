import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemsSection from './components/ProblemsSection';
import AudienciaSection from './components/AudienciaSection';
import DiagnosticIntro from './components/DiagnosticIntro';
import SolucionesSection from './components/SolucionesSection';
import TransitionQuote from './components/TransitionQuote';
import MetodoSection from './components/MetodoSection';
import PorQueSection from './components/PorQueSection';
import ContactoSection from './components/ContactoSection';
import Footer from './components/Footer';
import DiagnosticoFlow from './components/DiagnosticoFlow';

function App() {
  const [diagnosticoAbierto, setDiagnosticoAbierto] = useState(false);
  const openDiagnostic = () => setDiagnosticoAbierto(true);

  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      <Navbar />
      <main>
        <Hero onStartDiagnostic={openDiagnostic} />
        <ProblemsSection />
        <AudienciaSection />
        <TransitionQuote text="Cada momento necesita una mirada diferente." variant="horizon-light" />
        <DiagnosticIntro onStartDiagnostic={openDiagnostic} />
        <SolucionesSection />
        <TransitionQuote text="Antes de proponer soluciones, entendemos tu negocio." />
        <MetodoSection />
        <PorQueSection />
        <TransitionQuote
          text="Toda gran decisión empieza con una conversación clara."
          variant="horizon-light"
        />
        <ContactoSection onStartDiagnostic={openDiagnostic} />
      </main>
      <Footer />
      {diagnosticoAbierto && <DiagnosticoFlow onClose={() => setDiagnosticoAbierto(false)} />}
    </div>
  );
}

export default App;
