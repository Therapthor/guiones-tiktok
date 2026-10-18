import type { Guion } from "./esquema";
import { buscarPalabrasComplicadas } from "./palabras";

export const PALABRAS_POR_SEGUNDO = 2.5;
export const MAX_PALABRAS_GANCHO = 12;
export const MAX_PALABRAS_FRASE = 10;
export const SEGUNDOS_GANCHO = 3;
export const SEGUNDOS_CIERRE = 3;

export const contarPalabras = (texto: string) =>
  texto.split(/\s+/).filter((p) => /[\p{L}\p{N}]/u.test(p)).length;

export const frases = (texto: string) =>
  texto
    .split(/[.!?…]+/)
    .map((f) => f.trim())
    .filter(Boolean);

/** Palabras aproximadas que caben en el video completo. */
export const palabrasObjetivo = (duracion: number) => Math.round(duracion * PALABRAS_POR_SEGUNDO);

/** Segundos que debe durar el cuerpo (sin gancho ni cierre). */
export const segundosCuerpo = (duracion: number) => duracion - SEGUNDOS_GANCHO - SEGUNDOS_CIERRE;

export function textoHablado(g: Guion, gancho = 0, cierre = 0): string {
  return [g.ganchos[gancho]?.texto, ...g.escenas.map((e) => e.texto), g.cierres[cierre]]
    .filter(Boolean)
    .join(" ");
}

/** Revisa un guion contra las reglas. Devuelve la lista de problemas (vacía si cumple). */
export function revisarGuion(g: Guion, duracion: number, tiposDistintos = true): string[] {
  const cantidadGanchos = 5;
  const problemas: string[] = [];

  if (g.ganchos.length !== cantidadGanchos)
    problemas.push(`Debe tener ${cantidadGanchos} ganchos y tiene ${g.ganchos.length}.`);
  const tipos = new Set(g.ganchos.map((x) => x.tipo.toLowerCase()));
  if (tiposDistintos && tipos.size < g.ganchos.length) problemas.push("Hay ganchos repetidos del mismo tipo.");
  g.ganchos.forEach((x, i) => {
    const n = contarPalabras(x.texto);
    if (n > MAX_PALABRAS_GANCHO)
      problemas.push(`Gancho ${i + 1} tiene ${n} palabras (máximo ${MAX_PALABRAS_GANCHO}): "${x.texto}"`);
    if (/^(hola|hey|buenas|qué tal)\b/i.test(x.texto.trim()))
      problemas.push(`Gancho ${i + 1} empieza con un saludo.`);
  });

  if (g.cierres.length !== 3) problemas.push(`Debe tener 3 cierres y tiene ${g.cierres.length}.`);

  g.escenas.forEach((e, i) => {
    if (e.duracion < 2 || e.duracion > 4)
      problemas.push(`Escena ${i + 1} dura ${e.duracion} s (debe durar de 2 a 4 s).`);
    for (const f of frases(e.texto)) {
      const n = contarPalabras(f);
      if (n > MAX_PALABRAS_FRASE)
        problemas.push(`Escena ${i + 1}: frase de ${n} palabras (máximo ${MAX_PALABRAS_FRASE}): "${f}"`);
    }
  });

  const cuerpo = g.escenas.reduce((s, e) => s + e.duracion, 0);
  const esperado = segundosCuerpo(duracion);
  if (Math.abs(cuerpo - esperado) > Math.max(3, esperado * 0.2))
    problemas.push(`Las escenas suman ${cuerpo} s y deberían sumar unos ${esperado} s.`);

  const total = contarPalabras(textoHablado(g));
  const maximo = Math.round(palabrasObjetivo(duracion) * 1.15);
  if (total > maximo)
    problemas.push(`Tiene ${total} palabras: no se alcanza a decir en ${duracion} s (máximo ${maximo}).`);

  const todo = [...g.ganchos.map((x) => x.texto), ...g.escenas.map((e) => e.texto), ...g.cierres].join(" ");
  const dificiles = buscarPalabrasComplicadas(todo);
  if (dificiles.length) problemas.push(`Cambia estas palabras por otras más simples: ${dificiles.join(", ")}.`);

  return problemas;
}

/** Arregla detalles que no vale la pena pedirle a la IA. */
export function normalizarGuion(g: Guion): Guion {
  return {
    ...g,
    hashtags: [...new Set(g.hashtags.map((h) => "#" + h.replace(/^#+/, "").replace(/\s+/g, "")))].filter(
      (h) => h.length > 1,
    ),
  };
}
