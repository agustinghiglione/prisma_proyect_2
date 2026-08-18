import { useEffect } from 'react';

/** Bloquea el scroll de la página de fondo mientras un panel está abierto. */
export function useBodyScrollLock() {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);
}
