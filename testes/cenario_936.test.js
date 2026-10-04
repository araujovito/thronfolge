import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { criarCenario936 } from "../src/cenario_936.js";

const caminho = new URL("../dados/historico/personagens_936.json", import.meta.url);
const caminhoEscolha = new URL("../dados/historico/escolha_regia_936.json", import.meta.url);

test("cenário usa os cinco governantes históricos revisados", async () => {
  const dados = JSON.parse(await readFile(caminho, "utf8"));
  const estado = criarCenario936(dados);

  assert.equal(estado.regioes.length, 5);
  assert.deepEqual(
    new Set(estado.personagens.map((pessoa) => pessoa.id)),
    new Set(["otto", "eberhardo", "arnulfo", "hermano_suabia", "giselberto"]),
  );
  assert.equal(estado.eventos[0].tipo, "morte_do_rei");
  assert.ok(estado.personagens.every((pessoa) => pessoa.memoria.length === 1));
});

test("dados de jogo não alteram o arquivo histórico", async () => {
  const dados = JSON.parse(await readFile(caminho, "utf8"));
  const antes = structuredClone(dados);
  criarCenario936(dados);
  assert.deepEqual(dados, antes);
});

test("pretendentes recebem argumentos históricos sem transformá-los em roteiro", async () => {
  const dados = JSON.parse(await readFile(caminho, "utf8"));
  const escolha = JSON.parse(await readFile(caminhoEscolha, "utf8"));
  const estado = criarCenario936(dados, escolha);

  const otto = estado.personagens.find((pessoa) => pessoa.id === "otto");
  const giselberto = estado.personagens.find((pessoa) => pessoa.id === "giselberto");
  assert.match(otto.argumento_legitimidade, /Designado pelo pai/);
  assert.match(giselberto.argumento_legitimidade, /Nenhuma reivindicação/);
  assert.equal(estado.eleito, null);
});
