export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: '¿Tengo que contratar todos los módulos?',
    answer: 'No. Armás tu Prisma con los módulos que necesites. Si tu caso toca otras áreas, lo vemos juntos en la primera conversación.',
  },
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
    answer: 'Te pasamos una propuesta personalizada, con alcance y precio, para tu negocio. Sin presiones ni letra chica.',
  },
];
