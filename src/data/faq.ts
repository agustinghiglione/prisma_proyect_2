export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: '¿La primera conversación tiene costo?',
    answer: 'No. La primera conversación es sin costo y sin compromiso. Es un espacio para conocernos.',
  },
  {
    question: '¿Las reuniones son presenciales?',
    answer: 'Toda nuestra comunicación es virtual, para que puedas conversar con nosotros desde donde estés.',
  },
  {
    question: '¿Necesito completar el diagnóstico antes de agendar?',
    answer: 'No es obligatorio, pero te recomendamos hacerlo: nos ayuda a llegar a la conversación con una mirada más clara de tu negocio.',
  },
  {
    question: '¿Qué pasa después de la primera conversación?',
    answer: 'Si detectamos una oportunidad concreta, elaboramos una propuesta personalizada para tu negocio. Sin presiones ni letra chica.',
  },
];
