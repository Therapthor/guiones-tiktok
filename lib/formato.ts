import type { Guion } from "./esquema";
import { contarPalabras, textoHablado } from "./reglas";

/** Guion en texto plano, listo para copiar o leer al grabar. */
export function guionATexto(g: Guion, gancho = 0, cierre = 0): string {
  const segundos = 3 + g.escenas.reduce((s, e) => s + e.duracion, 0) + 3;
  const lineas = [
    `GANCHO (${g.ganchos[gancho]?.tipo ?? ""}): ${g.ganchos[gancho]?.texto ?? ""}`,
    "",
    ...g.escenas.map((e, i) => `${i + 1}. ${e.texto}\n   [${e.duracion} s · ${e.descripcion_visual}]`),
    "",
    `CIERRE: ${g.cierres[cierre] ?? ""}`,
    "",
    `Duración aprox.: ${segundos} s · ${contarPalabras(textoHablado(g, gancho, cierre))} palabras`,
    "",
    `Descripción: ${g.descripcion_post}`,
    g.hashtags.join(" "),
  ];
  return lineas.join("\n");
}

/** Prueba A/B: el mismo cuerpo con cada uno de los 5 ganchos. */
export function variantesAB(g: Guion, cierre = 0): string {
  return g.ganchos
    .map((_, i) => `===== VERSIÓN ${String.fromCharCode(65 + i)} =====\n${guionATexto(g, i, cierre)}`)
    .join("\n\n");
}
