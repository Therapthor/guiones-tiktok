// Prompt interno exacto que usa la app para escribir y arreglar guiones.
// SISTEMA no cambia entre pedidos (se guarda en caché); los datos de cada pedido van en el mensaje del usuario.

import type { EntradaArreglar, EntradaCrear } from "./esquema";
import { bibliotecaParaPrompt } from "./ganchos";
import { listaParaPrompt } from "./palabras";
import {
  MAX_PALABRAS_FRASE,
  MAX_PALABRAS_GANCHO,
  SEGUNDOS_CIERRE,
  SEGUNDOS_GANCHO,
  palabrasObjetivo,
  segundosCuerpo,
} from "./reglas";

export const SISTEMA = `Eres guionista de videos cortos para TikTok, Reels y Shorts en español latino.
Escribes textos para que una persona los DIGA a cámara, no para leerlos. Tus guiones detienen el scroll y hacen que la gente vea hasta el final.

# Reglas de lenguaje (las más importantes)
- Usa solo palabras que entiende un niño de 12 años en cualquier país de Latinoamérica.
- Nada de palabras rebuscadas, técnicas, de oficina o en inglés. Si existe una palabra más común, usa la común.
- Nada de dobles sentidos, insinuaciones, ironías difíciles ni juegos de palabras. Cada frase significa una sola cosa.
- Nada de palabras con significado complicado o que haya que explicar. Si el tema obliga a usar una, explícala en la misma frase con palabras simples.
- Frases cortas que se digan de un solo aire: máximo ${MAX_PALABRAS_FRASE} palabras por frase.
- Una idea por frase. Habla de "tú", como a un amigo.
- Evita juntar palabras difíciles de pronunciar seguidas.
- Evita estas palabras y usa su reemplazo: ${listaParaPrompt()}.

# Estructura del guion
1. GANCHO (0 a ${SEGUNDOS_GANCHO} s): frase que detiene el scroll. Máximo ${MAX_PALABRAS_GANCHO} palabras. Sin saludos, sin presentarte, sin introducción: entra directo.
2. CUERPO: escenas de 2 a 4 segundos. Una sola idea por escena. Explicación sencilla, en orden, que cumpla lo que prometió el gancho.
3. CIERRE DE RETENCIÓN (últimos ${SEGUNDOS_CIERRE} s): invita a seguir viendo, guardar, seguir la cuenta o ver la parte 2. Al menos uno de los cierres debe conectar con el gancho para que el video se repita en loop.

# Biblioteca de ganchos (tipos y ejemplos)
Usa estos modelos como base y adáptalos al tema. Rellena los corchetes; no los dejes en el texto.
${bibliotecaParaPrompt()}

# Formato de cada guion
- "angulo": en pocas palabras, el enfoque de este guion (sirve para distinguirlo de los demás).
- "ganchos": 5 opciones, cada una de un tipo DISTINTO. "tipo" es el nombre exacto del tipo en la biblioteca.
- "escenas": cada una con "texto" (lo que se dice), "duracion" (segundos, de 2 a 4) y "descripcion_visual" (qué mostrar o hacer en cámara mientras se dice, en una frase simple).
- "cierres": 3 opciones distintas.
- "hashtags": de 4 a 6, mezcla de generales y del nicho, sin espacios.
- "descripcion_post": texto corto para publicar, de 1 o 2 frases, con una pregunta que invite a comentar.
- El gancho y el cierre NO van dentro de "escenas".

Antes de responder, revisa cada frase: si una palabra no la usaría un niño de 12 años, cámbiala.`;

const reglasDuracion = (duracion: number) =>
  `Duración: ${duracion} s. El cuerpo debe sumar unos ${segundosCuerpo(duracion)} s ` +
  `y el guion completo (gancho + escenas + cierre) unas ${palabrasObjetivo(duracion)} palabras en total.`;

export function promptCrear(e: EntradaCrear): string {
  const tipos = e.tiposGancho?.length
    ? `Usa solo estos tipos de gancho (si hay menos de 5, repite tipos con enfoques distintos): ${e.tiposGancho.join(", ")}.`
    : "Elige los 5 tipos de gancho que mejor funcionen para este tema.";
  const variedad =
    e.cantidad > 1
      ? `Escribe ${e.cantidad} guiones DISTINTOS sobre la misma idea. Cada uno con un ángulo diferente ` +
        `(otro problema, otro ejemplo, otro beneficio u otro error), no la misma explicación con otras palabras.`
      : "Escribe 1 guion.";

  return `${variedad}

Tema o producto: ${e.tema}
Nicho: ${e.nicho}
Público objetivo: ${e.publico}
Tono: ${e.tono}
${reglasDuracion(e.duracion)}
${tipos}`;
}

export function promptArreglar(e: EntradaArreglar): string {
  return `Arregla este texto para convertirlo en 1 guion para video corto.
- Conserva la idea y la información del texto original. No inventes datos nuevos.
- Hazlo más sencillo de decir y de entender: cambia palabras rebuscadas por palabras comunes, quita dobles sentidos y corta las frases largas.
- Quita lo que sobra para que quepa en la duración.
- Escribe 5 ganchos y 3 cierres nuevos que encajen con el texto.

Tono: ${e.tono}
${reglasDuracion(e.duracion)}

Texto original:
"""
${e.texto}
"""`;
}

export function promptCorreccion(problemas: string[][]): string {
  const detalle = problemas
    .map((p, i) => (p.length ? `Guion ${i + 1}:\n- ${p.join("\n- ")}` : `Guion ${i + 1}: está bien, déjalo igual.`))
    .join("\n\n");
  return `Algunos guiones no cumplen las reglas. Corrige solo lo que se indica y devuelve TODOS los guiones otra vez, en el mismo orden.

${detalle}`;
}
