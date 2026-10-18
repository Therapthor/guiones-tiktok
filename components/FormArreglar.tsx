"use client";

import { useState } from "react";
import { DURACIONES, TONOS, type GuionRevisado } from "@/lib/esquema";
import { pedirGuiones } from "./almacen";

export function FormArreglar({ onListo }: { onListo: (g: GuionRevisado[], duracion: number) => void }) {
  const [texto, setTexto] = useState("");
  const [tono, setTono] = useState<(typeof TONOS)[number]>("Directo");
  const [duracion, setDuracion] = useState<(typeof DURACIONES)[number]>(30);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      onListo(await pedirGuiones("/api/arreglar", { texto, tono, duracion }), duracion);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div>
        <label className="etiqueta">Tu texto</label>
        <textarea
          className="campo min-h-48"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Pega aquí tu idea o tu guion. Lo dejo más simple, corto y fácil de decir."
          required
        />
      </div>

      <div>
        <label className="etiqueta">Tono</label>
        <div className="flex flex-wrap gap-2">
          {TONOS.map((t) => (
            <button type="button" key={t} onClick={() => setTono(t)} className={`chip ${tono === t ? "chip-on" : ""}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="etiqueta">Duración</label>
        <div className="flex gap-2">
          {DURACIONES.map((d) => (
            <button type="button" key={d} onClick={() => setDuracion(d)} className={`chip flex-1 ${duracion === d ? "chip-on" : ""}`}>
              {d} s
            </button>
          ))}
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

      <button className="boton w-full" disabled={cargando}>
        {cargando ? "Arreglando…" : "Arreglar texto"}
      </button>
    </form>
  );
}
