"use client";

import { useState } from "react";

export function Copiar({ texto, etiqueta = "Copiar", className = "boton-sec" }: { texto: () => string; etiqueta?: string; className?: string }) {
  const [hecho, setHecho] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await navigator.clipboard.writeText(texto());
        setHecho(true);
        setTimeout(() => setHecho(false), 1500);
      }}
    >
      {hecho ? "¡Copiado!" : etiqueta}
    </button>
  );
}
