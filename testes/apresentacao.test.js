import assert from "node:assert/strict";
import test from "node:test";

import { dataDoTurno, descreverEvento } from "../src/apresentacao.js";

test("data inicial preserva o dia e turnos seguintes mostram o mês", () => {
  assert.equal(dataDoTurno(0), "2 de julho de 936");
  assert.equal(dataDoTurno(1), "agosto de 936");
  assert.equal(dataDoTurno(6), "janeiro de 937");
});

test("tipo interno desconhecido nunca aparece para o jogador", () => {
  const texto = descreverEvento({ tipo: "nome_interno_secreto" }, (id) => id);
  assert.equal(texto, null);
});

test("descrições conhecidas usam os nomes exibidos", () => {
  const texto = descreverEvento(
    { tipo: "conversa", autor: "a", alvo: "b" },
    (id) => ({ a: "Otto", b: "Arnulfo" })[id],
  );
  assert.equal(texto, "Otto conversou a sós com Arnulfo.");
});

test("eleição usa a linguagem histórica sem falar em maioria ou votos", () => {
  const texto = descreverEvento(
    { tipo: "eleicao_regia", alvo: "otto" },
    () => "Otto",
  );
  assert.equal(texto, "Os grandes fizeram Otto rei e juraram-lhe fidelidade.");
  assert.doesNotMatch(texto, /maioria|vot/i);
});
