import { NextResponse } from "next/server";
import { errorIA, leerJson } from "@/lib/api";
import { generarGuiones } from "@/lib/claude";
import { EntradaCrear } from "@/lib/esquema";
import { guardarGuiones } from "@/lib/guardar";
import { promptCrear } from "@/lib/prompt";

export const maxDuration = 300;

export async function POST(req: Request) {
  const entrada = await leerJson(req, EntradaCrear);
  if (entrada instanceof NextResponse) return entrada;

  try {
    const guiones = await generarGuiones(promptCrear(entrada), {
      duracion: entrada.duracion,
      cantidad: entrada.cantidad,
      tiposDistintos: !entrada.tiposGancho?.length || entrada.tiposGancho.length >= 5,
    });
    const ids = await guardarGuiones("crear", entrada, guiones);
    return NextResponse.json({ guiones, ids });
  } catch (e) {
    return errorIA(e);
  }
}
