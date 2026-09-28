import FaqAccordion from './FaqAccordion';

export default function FaqSection() {
  return (
    <section id="preguntas" className="bg-background px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-heading text-2xl font-bold text-primary sm:text-3xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-8">
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
