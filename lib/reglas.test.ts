import assert from "node:assert/strict";
import { test } from "node:test";
import type { Guion } from "./esquema";
import { GANCHOS, TIPOS_GANCHO } from "./ganchos";
import { buscarPalabrasComplicadas } from "./palabras";
import { contarPalabras, normalizarGuion, revisarGuion } from "./reglas";

const base: Guion = {
  angulo: "Ahorro fácil",
  ganchos: TIPOS_GANCHO.slice(0, 5).map((tipo) => ({ tipo, texto: "Deja de hacer esto en el súper" })),
  escenas: Array.from({ length: 8 }, () => ({ texto: "Compra con una lista. Así gastas menos.", duracion: 3, descripcion_visual: "Muestra la lista" })),
  cierres: ["Guárdalo para tu próxima compra", "Sígueme para la parte 2", "Ahora ya sabes qué no hacer"],
  hashtags: ["ahorro", "#tips", "#tips"],
  descripcion_post: "¿Tú haces lista?",
};

test("la biblioteca tiene al menos 50 ganchos y todos los tipos", () => {
  assert.ok(GANCHOS.length >= 50);
  for (const t of TIPOS_GANCHO) assert.ok(GANCHOS.some((g) => g.tipo === t), t);
  for (const g of GANCHOS) assert.ok(contarPalabras(g.texto) <= 12, g.texto);
});

test("un guion correcto de 30 s no tiene problemas", () => {
  assert.deepEqual(revisarGuion(base, 30), []);
});

test("detecta gancho largo, frase larga y escena fuera de rango", () => {
  const g: Guion = {
    ...base,
    ganchos: [{ tipo: "POV", texto: "uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece" }, ...base.ganchos.slice(1)],
    escenas: [{ texto: "uno dos tres cuatro cinco seis siete ocho nueve diez once", duracion: 6, descripcion_visual: "" }, ...base.escenas.slice(1)],
  };
  const p = revisarGuion(g, 30).join("\n");
  assert.match(p, /Gancho 1 tiene 13 palabras/);
  assert.match(p, /frase de 11 palabras/);
  assert.match(p, /dura 6 s/);
});

test("detecta palabras complicadas, también conjugadas", () => {
  assert.deepEqual(buscarPalabrasComplicadas("Debes UTILIZAR esto y optimizando todo, no obstante"), ["utilizar", "optimizar", "no obstante"]);
  assert.deepEqual(buscarPalabrasComplicadas("Usa esto para tener más dinero"), []);
});

test("normaliza hashtags", () => {
  assert.deepEqual(normalizarGuion(base).hashtags, ["#ahorro", "#tips"]);
});
