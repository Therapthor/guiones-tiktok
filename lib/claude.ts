import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { RespuestaIA, type GuionRevisado } from "./esquema";
import { promptCorreccion, SISTEMA } from "./prompt";
import { normalizarGuion, revisarGuion } from "./reglas";

const MODELO = process.env.CLAUDE_MODEL || "claude-opus-5-5";

export class ErrorGuion extends Error {}

let cliente: Anthropic | null = null;
function getCliente() {
  if (!process.env.ANTHROPIC_API_KEY) throw new ErrorGuion("Falta configurar ANTHROPIC_API_KEY en el servidor.");
  return (cliente ??= new Anthropic());
}

type Mensaje = Anthropic.Beta.BetaMessageParam;

async function pedir(mensajes: Mensaje[]) {
  const stream = getCliente().beta.messages.stream({
    model: MODELO,
    max_tokens: 64000,
    // Si el modelo rechaza el pedido por error, la API lo reintenta en el modelo recomendado.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    thinking: { type: "adaptive" },
    output_config: { effort: "medium", format: betaZodOutputFormat(RespuestaIA) },
    system: [{ type: "text", text: SISTEMA, cache_control: { type: "ephemeral" } }],
    messages: mensajes,
  });
  const respuesta = await stream.finalMessage();

  if (respuesta.stop_reason === "refusal") throw new ErrorGuion("La IA no quiso escribir sobre este tema. Prueba con otro.");
  if (respuesta.stop_reason === "max_tokens") throw new ErrorGuion("La respuesta salió demasiado larga. Pide menos guiones.");

  const texto = respuesta.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  let datos: unknown;
  try {
    datos = JSON.parse(texto);
  } catch {
    throw new ErrorGuion("La IA devolvió una respuesta que no se pudo leer. Intenta de nuevo.");
  }
  const parseado = RespuestaIA.safeParse(datos);
  if (!parseado.success) throw new ErrorGuion("La IA devolvió un guion incompleto. Intenta de nuevo.");
  return { guiones: parseado.data.guiones.map(normalizarGuion), contenido: respuesta.content };
}

/**
 * Pide los guiones y los revisa contra las reglas. Si alguno falla, le devuelve los errores
 * a la IA una vez para que los corrija. Lo que siga fallando se devuelve como aviso.
 */
export async function generarGuiones(
  prompt: string,
  opciones: { duracion: number; cantidad: number; tiposDistintos?: boolean },
): Promise<GuionRevisado[]> {
  const revisar = (gs: Awaited<ReturnType<typeof pedir>>["guiones"]) =>
    gs.map((g) => revisarGuion(g, opciones.duracion, opciones.tiposDistintos ?? true));

  const mensajes: Mensaje[] = [{ role: "user", content: prompt }];
  let { guiones, contenido } = await pedir(mensajes);
  let problemas = revisar(guiones);

  const faltan = guiones.length !== opciones.cantidad;
  if (faltan || problemas.some((p) => p.length)) {
    const extra = faltan ? `\n\nDebes devolver exactamente ${opciones.cantidad} guiones.` : "";
    // Se agrega la respuesta completa (no solo el texto) para conservar el razonamiento del modelo.
    mensajes.push({ role: "assistant", content: contenido }, { role: "user", content: promptCorreccion(problemas) + extra });
    try {
      const corregido = await pedir(mensajes);
      const problemasCorregidos = revisar(corregido.guiones);
      const total = (ps: string[][]) => ps.reduce((s, p) => s + p.length, 0);
      if (corregido.guiones.length > 0 && total(problemasCorregidos) <= total(problemas)) {
        guiones = corregido.guiones;
        problemas = problemasCorregidos;
      }
    } catch (e) {
      // Si la corrección falla, nos quedamos con la primera versión y sus avisos.
      if (!(e instanceof ErrorGuion)) throw e;
    }
  }

  return guiones.slice(0, opciones.cantidad).map((g, i) => ({ ...g, avisos: problemas[i] ?? [] }));
}
