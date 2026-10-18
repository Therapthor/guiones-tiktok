import type { GuionRevisado } from "./esquema";
import { getSupabase } from "./supabase";

export type ItemHistorial = {
  id: string;
  created_at: string;
  modo: "crear" | "arreglar";
  entrada: Record<string, unknown>;
  guion: GuionRevisado;
};

/** Guarda los guiones en Supabase si está configurado. Devuelve los ids, o null si no hay base de datos. */
export async function guardarGuiones(
  modo: ItemHistorial["modo"],
  entrada: Record<string, unknown>,
  guiones: GuionRevisado[],
): Promise<string[] | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db
    .from("guiones")
    .insert(guiones.map((guion) => ({ modo, entrada, guion })))
    .select("id");
  if (error) {
    // El historial no debe impedir que el usuario reciba sus guiones.
    console.error("No se pudo guardar el historial:", error.message);
    return null;
  }
  return data.map((d) => d.id as string);
}
