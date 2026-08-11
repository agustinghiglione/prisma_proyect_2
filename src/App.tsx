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

const DIAGNOSTIC_DONE_KEY = 'prisma_diagnostic_completed';

function App() {
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [diagnosticCompleted, setDiagnosticCompleted] = useState(
    () => sessionStorage.getItem(DIAGNOSTIC_DONE_KEY) === 'true',
  );

  const openDiagnostic = () => setDiagnosticOpen(true);
  const closeDiagnostic = () => setDiagnosticOpen(false);
  const markDiagnosticCompleted = () => {
    sessionStorage.setItem(DIAGNOSTIC_DONE_KEY, 'true');
    setDiagnosticCompleted(true);
  };

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
        <ContactoSection diagnosticCompleted={diagnosticCompleted} onStartDiagnostic={openDiagnostic} />
      </main>
      <Footer />
      <DiagnosticModal open={diagnosticOpen} onClose={closeDiagnostic} onComplete={markDiagnosticCompleted} />
    </div>
  );
}

export default App;
