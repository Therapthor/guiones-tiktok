// Palabras rebuscadas, técnicas o de "oficina" y su reemplazo sencillo.
// Se usan en el prompt (para que la IA las evite) y en la revisión automática.

export const PALABRAS_COMPLICADAS: Record<string, string> = {
  utilizar: "usar",
  adquirir: "comprar",
  obtener: "conseguir",
  realizar: "hacer",
  efectuar: "hacer",
  ejecutar: "hacer",
  implementar: "poner en práctica",
  optimizar: "mejorar",
  potenciar: "hacer crecer",
  maximizar: "sacar más",
  minimizar: "bajar",
  incrementar: "subir",
  disminuir: "bajar",
  proporcionar: "dar",
  brindar: "dar",
  facilitar: "hacer más fácil",
  requerir: "necesitar",
  solicitar: "pedir",
  visualizar: "ver",
  finalizar: "terminar",
  gestionar: "manejar",
  monetizar: "ganar dinero con",
  apalancar: "aprovechar",
  empoderar: "dar fuerza",
  óptimo: "mejor",
  primordial: "lo más importante",
  imprescindible: "necesario",
  fundamental: "muy importante",
  significativo: "grande",
  exhaustivo: "completo",
  inherente: "propio",
  intrínseco: "propio",
  holístico: "completo",
  disruptivo: "nuevo",
  escalable: "que puede crecer",
  proactivo: "que se adelanta",
  resiliencia: "aguante",
  sinergia: "trabajo en equipo",
  paradigma: "forma de pensar",
  metodología: "forma",
  vanguardia: "lo más nuevo",
  posteriormente: "después",
  previamente: "antes",
  asimismo: "también",
  "no obstante": "pero",
  "por consiguiente": "por eso",
  "en consecuencia": "por eso",
  mediante: "con",
  aproximadamente: "más o menos",
  frecuentemente: "seguido",
  actualmente: "hoy",
  "con el fin de": "para",
  "en aras de": "para",
  "cabe destacar": "ojo",
  "es menester": "hay que",
  engagement: "interacción",
  mindset: "forma de pensar",
  insight: "idea",
  funnel: "embudo de ventas",
  branding: "imagen de marca",
  growth: "crecimiento",
  feedback: "opinión",
  target: "público",
};

const sinAcentos = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Devuelve las palabras complicadas encontradas en el texto (sin repetir). */
export function buscarPalabrasComplicadas(texto: string): string[] {
  const t = ` ${sinAcentos(texto).replace(/[^a-z0-9ñ]+/g, " ")} `;
  return Object.keys(PALABRAS_COMPLICADAS).filter((p) => {
    const raiz = sinAcentos(p);
    // Para verbos se busca también la raíz conjugada (utiliza, utilizando, realizó…).
    const esVerbo = /(ar|er|ir)$/.test(raiz) && !raiz.includes(" ");
    const patron = esVerbo ? raiz.slice(0, -2) : raiz;
    return esVerbo ? new RegExp(` ${patron}[a-z]{0,6} `).test(t) : t.includes(` ${patron} `);
  });
}

export function listaParaPrompt(): string {
  return Object.entries(PALABRAS_COMPLICADAS)
    .map(([dificil, simple]) => `"${dificil}" → "${simple}"`)
    .join(", ");
}
