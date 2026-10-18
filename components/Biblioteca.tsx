"use client";

import { useState } from "react";
import { GANCHOS, TIPOS_GANCHO } from "@/lib/ganchos";
import { Copiar } from "./Copiar";

export function Biblioteca() {
  const [tipo, setTipo] = useState<string | null>(null);
  const lista = tipo ? GANCHOS.filter((g) => g.tipo === tipo) : GANCHOS;

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-400">
        {GANCHOS.length} ganchos de los más usados en TikTok. Cambia lo que está entre [corchetes] por tu tema.
      </p>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button className={`chip shrink-0 ${tipo === null ? "chip-on" : ""}`} onClick={() => setTipo(null)}>
          Todos
        </button>
        {TIPOS_GANCHO.map((t) => (
          <button key={t} className={`chip shrink-0 ${tipo === t ? "chip-on" : ""}`} onClick={() => setTipo(t)}>
            {t}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {lista.map((g) => (
          <li key={g.texto} className="flex items-center gap-3 rounded-xl border border-neutral-800 p-3">
            <div className="flex-1">
              <p className="text-xs text-pink-400">{g.tipo}</p>
              <p className="font-medium">{g.texto}</p>
            </div>
            <Copiar texto={() => g.texto} />
          </li>
        ))}
      </ul>
    </div>
  );
}
