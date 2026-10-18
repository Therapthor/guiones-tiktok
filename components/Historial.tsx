"use client";

import { useEffect, useState } from "react";
import type { ItemHistorial } from "@/lib/guardar";
import { borrarLocal, leerLocal } from "./almacen";
import { TarjetaGuion } from "./TarjetaGuion";

export function Historial() {
  const [items, setItems] = useState<ItemHistorial[] | null>(null);
  const [enNube, setEnNube] = useState(false);
  const [abierto, setAbierto] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/historial")
      .then((r) => r.json())
      .then((d) => {
        setEnNube(d.disponible);
        setItems(d.disponible ? d.items : leerLocal());
      })
      .catch(() => setItems(leerLocal()));
  }, []);

  async function borrar(id: string) {
    if (!confirm("¿Borrar este guion?")) return;
    if (enNube) {
      const r = await fetch(`/api/historial?id=${id}`, { method: "DELETE" });
      if (!r.ok) return setError("No se pudo borrar.");
    } else borrarLocal(id);
    setItems((xs) => xs?.filter((x) => x.id !== id) ?? null);
  }

  if (!items) return <p className="text-neutral-500">Cargando…</p>;
  if (!items.length) return <p className="text-neutral-500">Todavía no hay guiones guardados.</p>;

  return (
    <div className="space-y-3">
      <p className="text-xs text-neutral-500">{enNube ? "Guardado en la nube (Supabase)." : "Guardado solo en este navegador."}</p>
      {error && <p className="text-sm text-red-300">{error}</p>}
      {items.map((it) => {
        const duracion = Number(it.entrada.duracion) || 30;
        const titulo = String(it.entrada.tema ?? it.entrada.texto ?? "").slice(0, 80);
        return (
          <div key={it.id} className="rounded-2xl border border-neutral-800">
            <button className="w-full p-3 text-left" onClick={() => setAbierto(abierto === it.id ? null : it.id)}>
              <p className="text-xs text-neutral-500">
                {new Date(it.created_at).toLocaleString("es")} · {it.modo === "crear" ? "Creado" : "Arreglado"} · {duracion} s
              </p>
              <p className="font-medium">{it.guion.ganchos[0]?.texto}</p>
              <p className="truncate text-sm text-neutral-400">{titulo}</p>
            </button>
            {abierto === it.id && (
              <div className="space-y-2 p-2 pt-0">
                <TarjetaGuion inicial={it.guion} numero={1} duracion={duracion} />
                <button className="w-full p-2 text-sm text-red-400" onClick={() => borrar(it.id)}>
                  Borrar del historial
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
