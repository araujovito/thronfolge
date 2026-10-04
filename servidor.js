import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const raiz = resolve(".");
const tipos = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

createServer(async (requisicao, resposta) => {
  try {
    const url = new URL(requisicao.url, "http://localhost");
    const relativo = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const arquivo = resolve(raiz, `.${relativo}`);
    if (arquivo !== raiz && !arquivo.startsWith(`${raiz}${sep}`)) {
      resposta.writeHead(403).end("Acesso negado");
      return;
    }
    const info = await stat(arquivo);
    if (!info.isFile()) throw new Error("não é arquivo");
    resposta.writeHead(200, { "Content-Type": tipos[extname(arquivo)] ?? "application/octet-stream" });
    createReadStream(arquivo).pipe(resposta);
  } catch {
    resposta.writeHead(404).end("Não encontrado");
  }
}).listen(8080, "127.0.0.1", () => {
  console.log("Thronfolge: http://127.0.0.1:8080");
});

