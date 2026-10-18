import { z } from "zod";

export const NICHOS = [
  "Ventas",
  "Motivación",
  "Curiosidades",
  "Tecnología",
  "Finanzas personales",
  "Salud y bienestar",
  "Comida",
  "Educación",
  "Emprendimiento",
  "Belleza",
  "Otro",
] as const;

export const TONOS = ["Directo", "Divertido", "Misterioso", "Polémico"] as const;
export const DURACIONES = [15, 30, 60] as const;

export const MAX_GUIONES = 10;

// ---------- Entradas ----------

export const EntradaCrear = z.object({
  tema: z.string().trim().min(3, "Escribe el tema o producto").max(500),
  nicho: z.string().trim().min(2).max(60),
  publico: z.string().trim().min(2, "Escribe el público").max(200),
  tono: z.enum(TONOS),
  duracion: z.union([z.literal(15), z.literal(30), z.literal(60)]),
  cantidad: z.number().int().min(1).max(MAX_GUIONES),
  tiposGancho: z.array(z.string()).max(16).optional(),
});
export type EntradaCrear = z.infer<typeof EntradaCrear>;

export const EntradaArreglar = z.object({
  texto: z.string().trim().min(10, "Pega un texto un poco más largo").max(6000),
  duracion: z.union([z.literal(15), z.literal(30), z.literal(60)]),
  tono: z.enum(TONOS),
});
export type EntradaArreglar = z.infer<typeof EntradaArreglar>;

// ---------- Salida de la IA ----------
// Sin límites numéricos aquí: el esquema se envía a la API como formato de salida.
// Las reglas (largo de frases, cantidad de ganchos, etc.) se revisan en reglas.ts.

export const Escena = z.object({
  texto: z.string(),
  duracion: z.number(),
  descripcion_visual: z.string(),
});

export const Guion = z.object({
  angulo: z.string(),
  ganchos: z.array(z.object({ tipo: z.string(), texto: z.string() })),
  escenas: z.array(Escena),
  cierres: z.array(z.string()),
  hashtags: z.array(z.string()),
  descripcion_post: z.string(),
});
export type Guion = z.infer<typeof Guion>;
export type Escena = z.infer<typeof Escena>;

export const RespuestaIA = z.object({ guiones: z.array(Guion) });
export type RespuestaIA = z.infer<typeof RespuestaIA>;

/** Guion con los avisos que quedaron tras la revisión automática. */
export type GuionRevisado = Guion & { avisos: string[] };
