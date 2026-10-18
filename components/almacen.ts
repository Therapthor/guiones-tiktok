"use client";

import type { GuionRevisado } from "@/lib/esquema";
import type { ItemHistorial } from "@/lib/guardar";

// Historial en el navegador, para cuando Supabase no está configurado.
const CLAVE = "guiones-historial";
const MAX = 100;

export function leerLocal(): ItemHistorial[] {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
  } catch {
    return [];
  }
}

export function guardarLocal(modo: ItemHistorial["modo"], entrada: Record<string, unknown>, guiones: GuionRevisado[]) {
  const ahora = new Date().toISOString();
  const nuevos = guiones.map((guion) => ({ id: crypto.randomUUID(), created_at: ahora, modo, entrada, guion }));
  try {
    localStorage.setItem(CLAVE, JSON.stringify([...nuevos, ...leerLocal()].slice(0, MAX)));
  } catch {
    // Sin espacio o sin permiso: el historial local es solo una ayuda.
  }
}

export function borrarLocal(id: string) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(leerLocal().filter((i) => i.id !== id)));
  } catch {}
}

/** Envía un pedido a la API y guarda en el historial local si no hay base de datos. */
export async function pedirGuiones(
  ruta: "/api/guiones" | "/api/arreglar",
  entrada: Record<string, unknown>,
): Promise<GuionRevisado[]> {
  const r = await fetch(ruta, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entrada),
  });
  const datos = await r.json().catch(() => ({ error: "Respuesta inválida del servidor." }));
  if (!r.ok) throw new Error(datos.error ?? "Algo salió mal.");
  if (!datos.ids) guardarLocal(ruta === "/api/guiones" ? "crear" : "arreglar", entrada, datos.guiones);
  return datos.guiones;
}
