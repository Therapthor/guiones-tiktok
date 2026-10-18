import { NextResponse, type NextRequest } from "next/server";

// Protección simple con usuario y contraseña (APP_USER / APP_PASSWORD).
// Si APP_PASSWORD está vacío, la app queda abierta (útil en local).
export function proxy(req: NextRequest) {
  const clave = process.env.APP_PASSWORD;
  if (!clave) return NextResponse.next();

  const usuario = process.env.APP_USER || "admin";
  const [tipo, valor] = (req.headers.get("authorization") ?? "").split(" ");
  if (tipo === "Basic" && valor) {
    const [u, ...resto] = atob(valor).split(":");
    if (u === usuario && resto.join(":") === clave) return NextResponse.next();
  }
  return new NextResponse("Acceso restringido", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Guiones TikTok", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
