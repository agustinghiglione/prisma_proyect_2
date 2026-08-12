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
import { GOOGLE_DIAGNOSTICO_FORM_URL } from './data/nav';

function App() {
  const openDiagnostic = () => {
    window.open(GOOGLE_DIAGNOSTICO_FORM_URL, '_blank', 'noopener,noreferrer');
  };

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
    </div>
  );
}

export default App;
