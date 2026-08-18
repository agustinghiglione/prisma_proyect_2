/** Barra de scroll fina y prolija para los paneles con overflow-y-auto, sin flechas arriba/abajo. */
export const SCROLL_PANEL =
  '[&::-webkit-scrollbar]:w-2.5 ' +
  '[&::-webkit-scrollbar-track]:my-3 [&::-webkit-scrollbar-track]:bg-transparent ' +
  '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:hover:bg-ink-soft/50 ' +
  '[&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-button]:h-0 [&::-webkit-scrollbar-button]:w-0';

export const SCROLL_PANEL_STYLE = { scrollbarWidth: 'thin', scrollbarColor: 'var(--color-border) transparent' } as const;
