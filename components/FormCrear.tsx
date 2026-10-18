"use client";

import { useState } from "react";
import { DURACIONES, MAX_GUIONES, NICHOS, TONOS, type GuionRevisado } from "@/lib/esquema";
import { TIPOS_GANCHO } from "@/lib/ganchos";
import { pedirGuiones } from "./almacen";

export function FormCrear({ onListo }: { onListo: (g: GuionRevisado[], duracion: number) => void }) {
  const [tema, setTema] = useState("");
  const [nicho, setNicho] = useState<string>(NICHOS[0]);
  const [otroNicho, setOtroNicho] = useState("");
  const [publico, setPublico] = useState("");
  const [tono, setTono] = useState<(typeof TONOS)[number]>("Directo");
  const [duracion, setDuracion] = useState<(typeof DURACIONES)[number]>(30);
  const [cantidad, setCantidad] = useState(3);
  const [tipos, setTipos] = useState<string[]>([]);
  const [verTipos, setVerTipos] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const n = nicho === "Otro" ? otroNicho : nicho;
      onListo(await pedirGuiones("/api/guiones", { tema, nicho: n, publico, tono, duracion, cantidad, tiposGancho: tipos }), duracion);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }

  const alternar = (t: string) => setTipos((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div>
        <label className="etiqueta">Tema o producto</label>
        <textarea className="campo min-h-24" value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Ej: cómo ahorrar en el súper" required />
      </div>

      <div>
        <label className="etiqueta">Nicho</label>
        <select className="campo" value={nicho} onChange={(e) => setNicho(e.target.value)}>
          {NICHOS.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        {nicho === "Otro" && (
          <input className="campo mt-2" value={otroNicho} onChange={(e) => setOtroNicho(e.target.value)} placeholder="Escribe tu nicho" required />
        )}
      </div>

      <div>
        <label className="etiqueta">Público objetivo</label>
        <input className="campo" value={publico} onChange={(e) => setPublico(e.target.value)} placeholder="Ej: mamás que trabajan" required />
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

      <div>
        <label className="etiqueta">¿Cuántos guiones? ({cantidad})</label>
        <input type="range" min={1} max={MAX_GUIONES} value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className="w-full accent-pink-500" />
        <p className="text-xs text-neutral-500">Cada guion trae un enfoque distinto de la misma idea y 5 ganchos para elegir.</p>
      </div>

      <div>
        <button type="button" className="text-sm text-pink-400" onClick={() => setVerTipos(!verTipos)}>
          {verTipos ? "▾" : "▸"} Tipos de gancho {tipos.length ? `(${tipos.length})` : "(la IA elige)"}
        </button>
        {verTipos && (
          <div className="mt-2 flex flex-wrap gap-2">
            {TIPOS_GANCHO.map((t) => (
              <button type="button" key={t} onClick={() => alternar(t)} className={`chip ${tipos.includes(t) ? "chip-on" : ""}`}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

      <button className="boton w-full" disabled={cargando}>
        {cargando ? `Escribiendo ${cantidad > 1 ? `${cantidad} guiones` : "guion"}…` : "Generar guiones"}
      </button>
      {cargando && <p className="text-center text-xs text-neutral-500">Puede tardar hasta un minuto.</p>}
    </form>
  );
}
