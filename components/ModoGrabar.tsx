"use client";

import { useEffect, useState } from "react";

/** Teleprompter: una frase por pantalla, texto grande. Toca a la derecha para avanzar y a la izquierda para volver. */
export function ModoGrabar({ partes, onCerrar }: { partes: { etiqueta: string; texto: string; nota?: string }[]; onCerrar: () => void }) {
  const [i, setI] = useState(0);
  const ir = (d: number) => setI((x) => Math.min(partes.length - 1, Math.max(0, x + d)));

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  });

  const p = partes[i];
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between p-4 text-sm text-neutral-400">
        <span>
          {p.etiqueta} · {i + 1}/{partes.length}
        </span>
        <button className="boton-sec" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-6 text-center">
        <button aria-label="Anterior" className="absolute inset-y-0 left-0 w-1/3" onClick={() => ir(-1)} />
        <button aria-label="Siguiente" className="absolute inset-y-0 right-0 w-2/3" onClick={() => ir(1)} />
        <div className="pointer-events-none">
          <p className="text-4xl font-bold leading-tight sm:text-5xl">{p.texto}</p>
          {p.nota && <p className="mt-6 text-base text-neutral-500">{p.nota}</p>}
        </div>
      </div>
      <div className="h-1 bg-neutral-900">
        <div className="h-full bg-pink-600 transition-all" style={{ width: `${((i + 1) / partes.length) * 100}%` }} />
      </div>
    </div>
  );
}
