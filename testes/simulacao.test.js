import assert from "node:assert/strict";
import test from "node:test";

import {
  avancarTurno,
  apoiosDe,
  calcularPoder,
  conheceEvento,
  criarEstado,
  decidirAcao,
  executarAcao,
  memoriasSobre,
  registrarEvento,
  relacaoCom,
  percepcaoDe,
  resolverTurno,
  validarAcao,
} from "../src/simulacao.js";

function mundo() {
  return criarEstado({
    personagens: [
      { id: "norte", ambicao: 70, soldados: 2, legitimidade: 2,
        percepcoes: { sul: { legitimidade: 4 } } },
      { id: "sul", ambicao: 60, soldados: 2, legitimidade: 4 },
      { id: "leste", ambicao: 40, soldados: 1, legitimidade: 1 },
    ],
  });
}

test("um fato secreto permanece desconhecido de quem não o presenciou", () => {
  const estado = mundo();
  const evento = registrarEvento(estado, {
    tipo: "humilhacao",
    autor: "sul",
    alvo: "norte",
    envolvidos: ["sul", "norte"],
    testemunhas: ["norte"],
    impactos: { norte: { sul: { rancor: 25, confianca: -10 } } },
  });

  assert.equal(conheceEvento(estado, "norte", evento.id), true);
  assert.equal(conheceEvento(estado, "sul", evento.id), true);
  assert.equal(conheceEvento(estado, "leste", evento.id), false);
  assert.deepEqual(relacaoCom(estado, "leste", "sul"), { confianca: 0, rancor: 0 });
});

test("a relação é explicável pela soma das memórias do observador", () => {
  const estado = mundo();
  registrarEvento(estado, {
    tipo: "ajuda",
    envolvidos: ["norte", "sul"],
    impactos: { norte: { sul: { confianca: 20 } } },
  });
  registrarEvento(estado, {
    tipo: "traicao",
    envolvidos: ["norte", "sul"],
    impactos: { norte: { sul: { confianca: -30, rancor: 40 } } },
  });

  assert.deepEqual(relacaoCom(estado, "norte", "sul"), {
    confianca: -10,
    rancor: 40,
  });
  assert.deepEqual(relacaoCom(estado, "sul", "norte"), {
    confianca: 0,
    rancor: 0,
  });
  assert.deepEqual(
    memoriasSobre(estado, "norte", "sul").map((item) => item.evento.tipo),
    ["ajuda", "traicao"],
  );
});

test("rancor conhecido altera a decisão, sem acesso a fatos globais", () => {
  const estado = mundo();
  registrarEvento(estado, {
    tipo: "ofensa",
    autor: "sul",
    alvo: "norte",
    envolvidos: ["norte", "sul"],
    impactos: { norte: { sul: { rancor: 30 } } },
  });

  assert.deepEqual(decidirAcao(estado, "norte"), {
    tipo: "difamar",
    autor: "norte",
    alvo: "sul",
  });
  assert.equal(decidirAcao(estado, "leste").tipo, "aguardar");
});

test("decisão usa legitimidade percebida, não o valor verdadeiro do rival", () => {
  const estado = criarEstado({
    personagens: [
      { id: "a", ambicao: 100, legitimidade: 10 },
      { id: "b", ambicao: 10, legitimidade: 100 },
    ],
  });
  assert.equal(percepcaoDe(estado, "a", "b").legitimidade, 0);
  assert.equal(decidirAcao(estado, "a").tipo, "aguardar");

  estado.personagens[0].percepcoes.b = { legitimidade: 20 };
  assert.equal(decidirAcao(estado, "a").tipo, "difamar");
});

test("poder expõe recursos concretos sem produzir uma pontuação mágica", () => {
  const estado = criarEstado({
    personagens: [
      { id: "a", ouro: 7, soldados: 3 },
      { id: "b", ouro: 2, soldados: 1 },
    ],
    regioes: [
      { id: "norte", governante: "a" },
      { id: "sul", governante: "a" },
    ],
  });
  assert.deepEqual(calcularPoder(estado, "a"), {
    territorios: 2,
    soldados: 3,
    ouro: 7,
  });
});

test("o mesmo estado inicial produz o mesmo turno", () => {
  const a = mundo();
  const b = mundo();
  avancarTurno(a);
  avancarTurno(b);
  assert.deepEqual(a, b);
});

test("desgaste político impede difamação repetitiva sem limite", () => {
  const estado = criarEstado({
    personagens: [
      { id: "ambicioso", ambicao: 100, legitimidade: 5,
        percepcoes: { rival: { legitimidade: 5 } } },
      { id: "rival", ambicao: 20, legitimidade: 5 },
    ],
  });
  for (let turno = 0; turno < 12; turno += 1) avancarTurno(estado);

  const ataques = estado.eventos.filter(
    (evento) => evento.tipo === "difamacao" && evento.autor === "ambicioso",
  );
  assert.ok(ataques.length > 0);
  assert.ok(ataques.length < 4);
  assert.ok(estado.personagens.find((pessoa) => pessoa.id === "rival").legitimidade > 0);
});

test("difamação pública chega a todos e atualiza legitimidade percebida", () => {
  const estado = criarEstado({
    personagens: [
      { id: "a", ambicao: 100, percepcoes: { b: { legitimidade: 5 } } },
      { id: "b", legitimidade: 5, percepcoes: { a: { legitimidade: 5 } } },
      { id: "c", percepcoes: { b: { legitimidade: 5 } } },
    ],
  });
  avancarTurno(estado);
  const difamacao = estado.eventos.find((evento) => evento.tipo === "difamacao");

  assert.equal(difamacao.publico, true);
  assert.equal(conheceEvento(estado, "c", difamacao.id), true);
  assert.equal(percepcaoDe(estado, "c", "b").legitimidade, 4);
});

test("estado recebido é copiado e ids duplicados são rejeitados", () => {
  const original = { personagens: [{ id: "a" }, { id: "b" }] };
  const estado = criarEstado(original);
  estado.personagens[0].ouro = 99;
  assert.equal(original.personagens[0].ouro, undefined);

  assert.throws(
    () => criarEstado({ personagens: [{ id: "a" }, { id: "a" }] }),
    /duplicado/,
  );
});

test("eventos carregados não causam ids repetidos", () => {
  const estado = criarEstado({
    personagens: [{ id: "a" }, { id: "b" }],
    eventos: [{ id: "evento_7", tipo: "antigo" }],
  });
  const novo = registrarEvento(estado, { tipo: "novo", autor: "a" });
  assert.equal(novo.id, "evento_8");

  assert.throws(
    () => criarEstado({
      personagens: [{ id: "a" }, { id: "b" }],
      eventos: [{ id: "evento_1" }, { id: "evento_1" }],
    }),
    /evento duplicado/,
  );
});

test("autor e alvo conhecem o evento mesmo se o chamador omitir envolvidos", () => {
  const estado = mundo();
  const evento = registrarEvento(estado, {
    tipo: "ameaca",
    autor: "norte",
    alvo: "sul",
  });
  assert.equal(conheceEvento(estado, "norte", evento.id), true);
  assert.equal(conheceEvento(estado, "sul", evento.id), true);
  assert.equal(conheceEvento(estado, "leste", evento.id), false);
});

test("conversa cria memórias diferentes para os dois participantes", () => {
  const estado = mundo();
  executarAcao(estado, { tipo: "conversar", autor: "norte", alvo: "sul" });
  assert.equal(relacaoCom(estado, "norte", "sul").confianca, 2);
  assert.equal(relacaoCom(estado, "sul", "norte").confianca, 5);
  assert.equal(estado.personagens.find((pessoa) => pessoa.id === "leste").memoria.length, 0);
});

test("amizade depende da percepção e da relação do alvo", () => {
  const estado = mundo();
  estado.personagens.find((pessoa) => pessoa.id === "sul").percepcoes.norte = {
    legitimidade: 45,
  };
  const aceito = executarAcao(estado, {
    tipo: "propor_amizade", autor: "norte", alvo: "sul",
  });
  assert.equal(aceito.tipo, "amizade_aceita");

  const outro = mundo();
  const recusado = executarAcao(outro, {
    tipo: "propor_amizade", autor: "norte", alvo: "sul",
  });
  assert.equal(recusado.tipo, "amizade_recusada");
});

test("apoio é concedido pela percepção do apoiador e pode mudar", () => {
  const estado = criarEstado({
    personagens: [
      { id: "a", legitimidade: 60 },
      { id: "b", percepcoes: { a: { legitimidade: 60 } } },
      { id: "c" },
    ],
    apoios: { a: "a", b: "b", c: "c" },
  });
  executarAcao(estado, { tipo: "conversar", autor: "a", alvo: "b" });
  executarAcao(estado, { tipo: "conversar", autor: "a", alvo: "b" });
  const evento = executarAcao(estado, { tipo: "pedir_apoio", autor: "a", alvo: "b" });

  assert.equal(evento.tipo, "apoio_concedido");
  assert.deepEqual(apoiosDe(estado, "a"), ["a", "b"]);
});

test("três apoios fazem o pretendente rei ao final do turno", () => {
  const estado = criarEstado({
    personagens: [
      { id: "a", legitimidade: 70 },
      { id: "b", percepcoes: { a: { legitimidade: 70 } } },
      { id: "c" },
    ],
    apoios: { a: "a", b: "b", c: "a" },
  });
  const eventos = resolverTurno(
    estado,
    { tipo: "pedir_apoio", autor: "a", alvo: "b" },
    "a",
  );

  assert.equal(estado.eleito, "a");
  assert.equal(estado.encerrado, "rei_eleito");
  assert.equal(eventos.at(-1).tipo, "eleicao_regia");
  assert.equal(conheceEvento(estado, "c", eventos.at(-1).id), true);
});

test("campanha termina sem consenso após vinte e quatro meses", () => {
  const estado = criarEstado({
    personagens: [{ id: "a" }, { id: "b" }],
    apoios: { a: "a", b: "b" },
  });
  for (let turno = 0; turno < 24; turno += 1) {
    resolverTurno(estado, { tipo: "aguardar", autor: "a" }, "a");
  }
  assert.equal(estado.encerrado, "sem_consenso");
  assert.equal(estado.eventos.at(-1).tipo, "fim_sem_consenso");
  assert.deepEqual(
    validarAcao(estado, { tipo: "aguardar", autor: "a" }),
    { valida: false, motivo: "a escolha do rei já terminou" },
  );
});

test("turno do jogador não deixa a IA decidir por ele", () => {
  const estado = mundo();
  const eventos = resolverTurno(
    estado,
    { tipo: "conversar", autor: "norte", alvo: "sul" },
    "norte",
  );
  assert.equal(estado.turno, 1);
  assert.equal(eventos.filter((evento) => evento.autor === "norte").length, 1);
  assert.equal(eventos.find((evento) => evento.autor === "norte").tipo, "conversa");
});

test("ações inválidas são rejeitadas antes de alterar o estado", () => {
  const estado = mundo();
  const antes = structuredClone(estado);
  assert.deepEqual(
    validarAcao(estado, { tipo: "conversar", autor: "norte", alvo: "norte" }),
    { valida: false, motivo: "o personagem não pode ser o próprio alvo" },
  );
  assert.throws(
    () => executarAcao(estado, { tipo: "conversar", autor: "norte", alvo: "norte" }),
    /próprio alvo/,
  );
  assert.deepEqual(estado, antes);
});

test("turno inteiro permanece intacto quando a ação do jogador é inválida", () => {
  const estado = mundo();
  const antes = structuredClone(estado);
  assert.throws(
    () => resolverTurno(
      estado,
      { tipo: "conversar", autor: "norte", alvo: "norte" },
      "norte",
    ),
    /próprio alvo/,
  );
  assert.deepEqual(estado, antes);
});
