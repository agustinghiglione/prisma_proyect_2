import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemsSection from './components/ProblemsSection';
import DiagnosticIntro from './components/DiagnosticIntro';
import SolucionesSection from './components/SolucionesSection';
import TransitionQuote from './components/TransitionQuote';
import MetodoSection from './components/MetodoSection';
import PorQueSection from './components/PorQueSection';
import ContactoSection from './components/ContactoSection';
import Footer from './components/Footer';
import DiagnosticModal from './components/diagnostic/DiagnosticModal';

function App() {
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);

  const openDiagnostic = () => setDiagnosticOpen(true);
  const closeDiagnostic = () => setDiagnosticOpen(false);

  return (
    <div className="min-h-screen bg-background font-sans text-ink antialiased">
      <Navbar />
      <main>
        <Hero onStartDiagnostic={openDiagnostic} />
        <ProblemsSection onStartDiagnostic={openDiagnostic} />
        <DiagnosticIntro onStartDiagnostic={openDiagnostic} />
        <SolucionesSection />
        <TransitionQuote text="Antes de proponer soluciones, entendemos tu negocio." />
        <MetodoSection />
        <PorQueSection />
        <TransitionQuote text="Toda gran decisión empieza con una conversación clara." />
        <ContactoSection />
      </main>
      <Footer />
      <DiagnosticModal open={diagnosticOpen} onClose={closeDiagnostic} />
    </div>
  );
}

export default App;
