import { NextResponse } from "next/server";
import { error } from "@/lib/api";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const db = getSupabase();
  if (!db) return NextResponse.json({ disponible: false, items: [] });
  const { data, error: e } = await db
    .from("guiones")
    .select("id, created_at, modo, entrada, guion")
    .order("created_at", { ascending: false })
    .limit(100);
  if (e) return error("No se pudo leer el historial.", 500);
  return NextResponse.json({ disponible: true, items: data });
}

export async function DELETE(req: Request) {
  const db = getSupabase();
  const id = new URL(req.url).searchParams.get("id");
  if (!db) return error("El historial en la nube no está configurado.", 501);
  if (!id) return error("Falta el id.");
  const { error: e } = await db.from("guiones").delete().eq("id", id);
  if (e) return error("No se pudo borrar.", 500);
  return NextResponse.json({ ok: true });
}
