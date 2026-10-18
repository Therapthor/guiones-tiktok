import { NextResponse } from "next/server";
import { errorIA, leerJson } from "@/lib/api";
import { generarGuiones } from "@/lib/claude";
import { EntradaArreglar } from "@/lib/esquema";
import { guardarGuiones } from "@/lib/guardar";
import { promptArreglar } from "@/lib/prompt";

export const maxDuration = 300;

export async function POST(req: Request) {
  const entrada = await leerJson(req, EntradaArreglar);
  if (entrada instanceof NextResponse) return entrada;

  try {
    const guiones = await generarGuiones(promptArreglar(entrada), { duracion: entrada.duracion, cantidad: 1 });
    const ids = await guardarGuiones("arreglar", entrada, guiones);
    return NextResponse.json({ guiones, ids });
  } catch (e) {
    return errorIA(e);
  }
}
