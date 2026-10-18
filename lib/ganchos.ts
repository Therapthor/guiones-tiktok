// Biblioteca de ganchos más usados en TikTok, Reels y Shorts.
// Los corchetes son huecos que la IA (o tú) rellena: [tema], [problema], [resultado], etc.

export const TIPOS_GANCHO = [
  "Pregunta directa",
  "Error común",
  "Secreto",
  "Dato impactante",
  "POV",
  "Lista",
  "Antes y después",
  "Opinión impopular",
  "Curiosidad incompleta",
  "Llamado directo",
  "Historia personal",
  "Mito o verdad",
  "Advertencia",
  "Reto",
  "Comparación",
  "Paso a paso",
] as const;

export type TipoGancho = (typeof TIPOS_GANCHO)[number];

export interface PlantillaGancho {
  tipo: TipoGancho;
  texto: string;
}

export const GANCHOS: PlantillaGancho[] = [
  // Pregunta directa
  { tipo: "Pregunta directa", texto: "¿Sabías que [dato sobre tema]?" },
  { tipo: "Pregunta directa", texto: "¿Por qué nadie habla de [tema]?" },
  { tipo: "Pregunta directa", texto: "¿Te pasa que [problema]?" },
  { tipo: "Pregunta directa", texto: "¿Qué pasaría si [situación]?" },

  // Error común
  { tipo: "Error común", texto: "Deja de hacer esto si quieres [resultado]" },
  { tipo: "Error común", texto: "El error que casi todos cometen con [tema]" },
  { tipo: "Error común", texto: "Si haces esto con [tema], lo estás haciendo mal" },
  { tipo: "Error común", texto: "Yo también hacía esto mal con [tema]" },

  // Secreto
  { tipo: "Secreto", texto: "Nadie te dice esto sobre [tema]" },
  { tipo: "Secreto", texto: "Lo que [expertos] no quieren que sepas" },
  { tipo: "Secreto", texto: "El truco que uso para [resultado]" },
  { tipo: "Secreto", texto: "Esto debí saberlo hace años" },

  // Dato impactante
  { tipo: "Dato impactante", texto: "[Número] de cada 10 personas hacen esto mal" },
  { tipo: "Dato impactante", texto: "Esto cambia todo lo que sabes de [tema]" },
  { tipo: "Dato impactante", texto: "En [tiempo] logré [resultado], así lo hice" },
  { tipo: "Dato impactante", texto: "Gasté [cantidad] para aprender esto. Tú gratis" },

  // POV
  { tipo: "POV", texto: "POV: acabas de descubrir [cosa]" },
  { tipo: "POV", texto: "POV: por fin entiendes [tema]" },
  { tipo: "POV", texto: "POV: eres [público] y te pasa esto" },
  { tipo: "POV", texto: "POV: alguien te explica [tema] fácil" },

  // Lista
  { tipo: "Lista", texto: "3 cosas que nadie te dijo de [tema]" },
  { tipo: "Lista", texto: "3 errores que te impiden [resultado]" },
  { tipo: "Lista", texto: "5 cosas que hago antes de [acción]" },
  { tipo: "Lista", texto: "2 trucos para [resultado] hoy mismo" },

  // Antes y después
  { tipo: "Antes y después", texto: "Así estaba… así quedó" },
  { tipo: "Antes y después", texto: "Antes hacía [cosa]. Ahora hago esto" },
  { tipo: "Antes y después", texto: "Mira la diferencia con un solo cambio" },
  { tipo: "Antes y después", texto: "Hace un año [situación]. Hoy [resultado]" },

  // Opinión impopular
  { tipo: "Opinión impopular", texto: "Opinión impopular: [idea]" },
  { tipo: "Opinión impopular", texto: "Esto que te enseñaron sobre [tema] no funciona" },
  { tipo: "Opinión impopular", texto: "Me van a odiar por decir esto" },
  { tipo: "Opinión impopular", texto: "[Cosa popular] no sirve. Te explico por qué" },

  // Curiosidad incompleta
  { tipo: "Curiosidad incompleta", texto: "Lo que pasó después nadie lo esperaba" },
  { tipo: "Curiosidad incompleta", texto: "Probé [cosa] por [tiempo] y pasó esto" },
  { tipo: "Curiosidad incompleta", texto: "Mira hasta el final, no te lo vas a creer" },
  { tipo: "Curiosidad incompleta", texto: "Esto es lo último que esperas de [tema]" },

  // Llamado directo
  { tipo: "Llamado directo", texto: "Si tienes [problema], mira esto" },
  { tipo: "Llamado directo", texto: "Si eres [público], esto es para ti" },
  { tipo: "Llamado directo", texto: "Guarda este video si quieres [resultado]" },
  { tipo: "Llamado directo", texto: "No sigas bajando si te importa [tema]" },

  // Historia personal
  { tipo: "Historia personal", texto: "El día que [situación], todo cambió" },
  { tipo: "Historia personal", texto: "Casi me rindo con [tema], hasta que…" },
  { tipo: "Historia personal", texto: "Te cuento cómo pasé de [antes] a [después]" },
  { tipo: "Historia personal", texto: "Nunca pensé que [cosa] me pasaría a mí" },

  // Mito o verdad
  { tipo: "Mito o verdad", texto: "¿Mito o verdad? [creencia]" },
  { tipo: "Mito o verdad", texto: "Esto que crees de [tema] es mentira" },
  { tipo: "Mito o verdad", texto: "Te dijeron [creencia]. No es así" },

  // Advertencia
  { tipo: "Advertencia", texto: "No compres [cosa] sin ver esto" },
  { tipo: "Advertencia", texto: "Cuidado con [cosa], te puede costar caro" },
  { tipo: "Advertencia", texto: "Antes de [acción], mira este video" },

  // Reto
  { tipo: "Reto", texto: "Te reto a [acción] por [tiempo]" },
  { tipo: "Reto", texto: "A que no sabías hacer esto con [cosa]" },
  { tipo: "Reto", texto: "Solo el 1% sabe esto de [tema]" },

  // Comparación
  { tipo: "Comparación", texto: "[Opción A] o [opción B]: ¿cuál conviene?" },
  { tipo: "Comparación", texto: "Lo barato contra lo caro: [cosa]" },
  { tipo: "Comparación", texto: "Lo que hace la mayoría vs. lo que funciona" },

  // Paso a paso
  { tipo: "Paso a paso", texto: "Cómo [resultado] en [número] pasos" },
  { tipo: "Paso a paso", texto: "Así se hace [cosa] en menos de un minuto" },
  { tipo: "Paso a paso", texto: "La forma más fácil de [acción]" },
];

/** Texto de la biblioteca agrupado por tipo, para el prompt interno. */
export function bibliotecaParaPrompt(tipos: readonly string[] = TIPOS_GANCHO): string {
  return tipos
    .map((tipo) => {
      const ejemplos = GANCHOS.filter((g) => g.tipo === tipo).map((g) => `"${g.texto}"`);
      return `- ${tipo}: ${ejemplos.join(" | ")}`;
    })
    .join("\n");
}
