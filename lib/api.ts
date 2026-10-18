import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { ErrorGuion } from "./claude";

export const error = (mensaje: string, status = 400) => NextResponse.json({ error: mensaje }, { status });

export async function leerJson<T>(req: Request, esquema: ZodType<T>): Promise<T | NextResponse> {
  let cuerpo: unknown;
  try {
    cuerpo = await req.json();
  } catch {
    return error("Datos inválidos.");
  }
  const r = esquema.safeParse(cuerpo);
  return r.success ? r.data : error(r.error.issues[0]?.message ?? "Datos inválidos.");
}

/** Traduce errores de la IA a mensajes claros para el usuario. */
export function errorIA(e: unknown): NextResponse {
  if (e instanceof ErrorGuion) return error(e.message, 422);
  if (e instanceof Anthropic.AuthenticationError) return error("La clave de la API de Claude no es válida.", 500);
  if (e instanceof Anthropic.RateLimitError) return error("Demasiados pedidos seguidos. Espera un momento.", 429);
  if (e instanceof Anthropic.APIConnectionError) return error("No se pudo conectar con la IA. Intenta de nuevo.", 502);
  if (e instanceof Anthropic.APIError) return error(`Error de la IA (${e.status}). Intenta de nuevo.`, 502);
  console.error(e);
  return error("Algo salió mal. Intenta de nuevo.", 500);
}
