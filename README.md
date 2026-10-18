# Guiones TikTok

App web (apta para celular) que escribe guiones simples y potentes para TikTok, Reels y Shorts, listos para grabar.

- **Crear**: tema, nicho, público, tono, duración (15/30/60 s) y cuántos guiones quieres (1 a 10). Cada guion trae un enfoque distinto, 5 ganchos y 3 cierres para elegir.
- **Arreglar**: pegas tu texto y lo deja más corto, simple y fácil de decir.
- **Ganchos**: biblioteca de 59 ganchos de los más usados, en 16 tipos.
- **Historial**: en Supabase si está configurado; si no, en el navegador.
- **Modo grabar**: teleprompter con una frase por pantalla.
- **Copiar 5 versiones A/B**: el mismo cuerpo con cada gancho.

## Cómo funciona

```
app/page.tsx              Interfaz (pestañas Crear, Arreglar, Ganchos, Historial)
app/api/guiones           POST: crea guiones nuevos
app/api/arreglar          POST: arregla un texto
app/api/historial         GET / DELETE del historial en Supabase
lib/prompt.ts             Prompt interno exacto que usa la IA
lib/ganchos.ts            Biblioteca de ganchos
lib/palabras.ts           Palabras rebuscadas prohibidas y su reemplazo simple
lib/reglas.ts             Revisión automática (largo de frases, ganchos, duración, palabras)
lib/claude.ts             Llamada a Claude con salida JSON y una ronda de corrección
proxy.ts                  Usuario y contraseña opcionales
supabase/schema.sql       Tabla del historial
```

Flujo: la app arma el prompt → Claude responde en JSON validado → `lib/reglas.ts` revisa cada guion
→ si algo no cumple, le devuelve los errores a Claude una vez para que lo corrija → lo que siga fallando
se muestra como aviso en la tarjeta. Los avisos se recalculan al editar.

Reglas que se revisan: gancho ≤ 12 palabras y sin saludo, 5 ganchos de tipos distintos, 3 cierres,
frases ≤ 10 palabras, escenas de 2–4 s que sumen la duración, unas 2,5 palabras por segundo y ninguna palabra de la lista de `lib/palabras.ts`.

## Ejecutar en local

Requiere Node 20 o superior.

```bash
npm install
cp .env.example .env.local   # pon tu ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
npm test                     # pruebas de las reglas
```

## Historial en Supabase (opcional)

1. Crea un proyecto en supabase.com.
2. En **SQL Editor** ejecuta `supabase/schema.sql`.
3. En **Project Settings → API** copia la URL y la `service_role` key a `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.

La clave `service_role` solo se usa en el servidor; nunca llega al navegador.

## Desplegar en Vercel

1. En vercel.com → **Add New → Project** → importa `guiones-tiktok`.
2. En **Environment Variables** agrega `ANTHROPIC_API_KEY`, `APP_PASSWORD` (recomendado, la URL es pública)
   y, si usas historial en la nube, las dos de Supabase.
3. **Deploy**. Al abrir la URL, el navegador pide usuario (`APP_USER`, por defecto `admin`) y contraseña.

Las rutas de la IA tienen `maxDuration = 300` s; pedir 10 guiones de 60 s puede tardar más de un minuto.
