"use client";

import { useMemo, useState } from "react";
import type { GuionRevisado } from "@/lib/esquema";
import { guionATexto, variantesAB } from "@/lib/formato";
import { contarPalabras, revisarGuion, textoHablado } from "@/lib/reglas";
import { Copiar } from "./Copiar";
import { ModoGrabar } from "./ModoGrabar";

export function TarjetaGuion({ inicial, numero, duracion }: { inicial: GuionRevisado; numero: number; duracion: number }) {
  const [g, setG] = useState(inicial);
  const [gancho, setGancho] = useState(0);
  const [cierre, setCierre] = useState(0);
  const [editando, setEditando] = useState(false);
  const [grabando, setGrabando] = useState(false);

  const avisos = useMemo(() => revisarGuion(g, duracion, false), [g, duracion]);
  const segundos = 6 + g.escenas.reduce((s, e) => s + e.duracion, 0);
  const palabras = contarPalabras(textoHablado(g, gancho, cierre));

  const cambiarGancho = (i: number, texto: string) =>
    setG({ ...g, ganchos: g.ganchos.map((x, j) => (j === i ? { ...x, texto } : x)) });
  const cambiarCierre = (i: number, texto: string) => setG({ ...g, cierres: g.cierres.map((x, j) => (j === i ? texto : x)) });
  const cambiarEscena = (i: number, campo: "texto" | "duracion", valor: string) =>
    setG({
      ...g,
      escenas: g.escenas.map((e, j) => (j === i ? { ...e, [campo]: campo === "duracion" ? Number(valor) || 0 : valor } : e)),
    });
  const quitarEscena = (i: number) => setG({ ...g, escenas: g.escenas.filter((_, j) => j !== i) });
  const agregarEscena = () => setG({ ...g, escenas: [...g.escenas, { texto: "", duracion: 3, descripcion_visual: "" }] });

  const partes = [
    { etiqueta: "Gancho", texto: g.ganchos[gancho]?.texto ?? "" },
    ...g.escenas.map((e, i) => ({ etiqueta: `Escena ${i + 1}`, texto: e.texto, nota: e.descripcion_visual })),
    { etiqueta: "Cierre", texto: g.cierres[cierre] ?? "" },
  ];

  return (
    <article className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-pink-400">Guion {numero}</p>
          <h3 className="font-semibold">{g.angulo}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
          ~{segundos} s · {palabras} pal.
        </span>
      </header>

      <section>
        <p className="etiqueta">Elige el gancho</p>
        <div className="space-y-2">
          {g.ganchos.map((x, i) => (
            <label key={i} className={`block rounded-xl border p-3 ${gancho === i ? "border-pink-500 bg-pink-500/10" : "border-neutral-800"}`}>
              <span className="flex items-center gap-2 text-xs text-neutral-400">
                <input type="radio" checked={gancho === i} onChange={() => setGancho(i)} className="accent-pink-500" />
                {x.tipo}
              </span>
              {editando ? (
                <input className="campo mt-2" value={x.texto} onChange={(e) => cambiarGancho(i, e.target.value)} />
              ) : (
                <span className="mt-1 block text-lg font-semibold">{x.texto}</span>
              )}
            </label>
          ))}
        </div>
      </section>

      <section>
        <p className="etiqueta">Cuerpo</p>
        <ol className="space-y-2">
          {g.escenas.map((e, i) => (
            <li key={i} className="rounded-xl bg-neutral-950 p-3">
              {editando ? (
                <div className="space-y-2">
                  <textarea className="campo min-h-16" value={e.texto} onChange={(ev) => cambiarEscena(i, "texto", ev.target.value)} />
                  <div className="flex items-center gap-2 text-sm">
                    <input type="number" min={2} max={4} className="campo w-20 py-2" value={e.duracion} onChange={(ev) => cambiarEscena(i, "duracion", ev.target.value)} />
                    <span className="text-neutral-500">seg</span>
                    <button type="button" className="ml-auto text-red-400" onClick={() => quitarEscena(i)}>
                      Quitar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-base">{e.texto}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {e.duracion} s · 🎥 {e.descripcion_visual}
                  </p>
                </>
              )}
            </li>
          ))}
        </ol>
        {editando && (
          <button type="button" className="boton-sec mt-2 w-full" onClick={agregarEscena}>
            + Agregar escena
          </button>
        )}
      </section>

      <section>
        <p className="etiqueta">Elige el cierre</p>
        <div className="space-y-2">
          {g.cierres.map((c, i) => (
            <label key={i} className={`flex items-center gap-2 rounded-xl border p-3 ${cierre === i ? "border-pink-500 bg-pink-500/10" : "border-neutral-800"}`}>
              <input type="radio" checked={cierre === i} onChange={() => setCierre(i)} className="accent-pink-500" />
              {editando ? <input className="campo" value={c} onChange={(e) => cambiarCierre(i, e.target.value)} /> : <span>{c}</span>}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-1 text-sm">
        <p className="text-neutral-300">{g.descripcion_post}</p>
        <p className="text-pink-300">{g.hashtags.join(" ")}</p>
      </section>

      {avisos.length > 0 && (
        <details className="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200">
          <summary>{avisos.length} aviso(s) para revisar</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {avisos.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </details>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="boton col-span-2" onClick={() => setGrabando(true)}>
          🎬 Modo grabar
        </button>
        <button type="button" className="boton-sec" onClick={() => setEditando(!editando)}>
          {editando ? "Listo" : "Editar"}
        </button>
        <Copiar texto={() => guionATexto(g, gancho, cierre)} etiqueta="Copiar guion" />
        <Copiar texto={() => variantesAB(g, cierre)} etiqueta="Copiar 5 versiones A/B" className="boton-sec col-span-2" />
      </div>

      {grabando && <ModoGrabar partes={partes} onCerrar={() => setGrabando(false)} />}
    </article>
  );
}
