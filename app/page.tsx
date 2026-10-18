"use client";

import { useRef, useState } from "react";
import { Biblioteca } from "@/components/Biblioteca";
import { FormArreglar } from "@/components/FormArreglar";
import { FormCrear } from "@/components/FormCrear";
import { Historial } from "@/components/Historial";
import { TarjetaGuion } from "@/components/TarjetaGuion";
import type { GuionRevisado } from "@/lib/esquema";

const PESTANAS = ["Crear", "Arreglar", "Ganchos", "Historial"] as const;
type Pestana = (typeof PESTANAS)[number];

export default function Inicio() {
  const [pestana, setPestana] = useState<Pestana>("Crear");
  const [resultado, setResultado] = useState<{ guiones: GuionRevisado[]; duracion: number; id: number } | null>(null);
  const refResultados = useRef<HTMLDivElement>(null);

  const listo = (guiones: GuionRevisado[], duracion: number) => {
    setResultado({ guiones, duracion, id: Date.now() });
    setTimeout(() => refResultados.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <main className="mx-auto min-h-dvh max-w-xl px-4 pb-16">
      <header className="sticky top-0 z-10 -mx-4 bg-neutral-950/90 px-4 pt-4 backdrop-blur">
        <h1 className="text-xl font-bold">
          Guiones <span className="text-pink-500">TikTok</span>
        </h1>
        <nav className="mt-3 grid grid-cols-4 border-b border-neutral-800 text-sm">
          {PESTANAS.map((p) => (
            <button
              key={p}
              onClick={() => setPestana(p)}
              className={`pb-2 pt-1 ${pestana === p ? "border-b-2 border-pink-500 font-semibold text-white" : "text-neutral-500"}`}
            >
              {p}
            </button>
          ))}
        </nav>
      </header>

      <div className="pt-5">
        {pestana === "Crear" && <FormCrear onListo={listo} />}
        {pestana === "Arreglar" && <FormArreglar onListo={listo} />}
        {pestana === "Ganchos" && <Biblioteca />}
        {pestana === "Historial" && <Historial />}
      </div>

      {resultado && (pestana === "Crear" || pestana === "Arreglar") && (
        <div ref={refResultados} className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">
            {resultado.guiones.length} guion{resultado.guiones.length > 1 ? "es" : ""} listo{resultado.guiones.length > 1 ? "s" : ""}
          </h2>
          {resultado.guiones.map((g, i) => (
            <TarjetaGuion key={`${resultado.id}-${i}`} inicial={g} numero={i + 1} duracion={resultado.duracion} />
          ))}
        </div>
      )}
    </main>
  );
}
