// Servidor estático mínimo para probar el juego en local: node tests/servidor.js
// (El juego también funciona abriendo index.html directamente.)
const http = require("http");
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const puerto = Number(process.env.PORT) || 8765;
const tipos = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json", ".md": "text/plain; charset=utf-8" };

http.createServer((req, res) => {
  let ruta = decodeURIComponent(req.url.split("?")[0]);
  if (ruta.endsWith("/")) ruta += "index.html";
  const archivo = path.join(raiz, path.normalize(ruta));
  if (!archivo.startsWith(raiz)) { res.writeHead(403); res.end(); return; }
  fs.readFile(archivo, (err, datos) => {
    if (err) { res.writeHead(404); res.end("No encontrado"); return; }
    res.writeHead(200, { "Content-Type": tipos[path.extname(archivo)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(datos);
  });
}).listen(puerto, "127.0.0.1", () => console.log("Sirviendo en http://localhost:" + puerto));
