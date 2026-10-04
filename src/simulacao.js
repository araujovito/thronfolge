function copiar(valor) {
  return structuredClone(valor);
}

function exigir(condicao, mensagem) {
  if (!condicao) throw new Error(mensagem);
}

export function criarEstado(configuracao) {
  const estado = copiar(configuracao);
  estado.turno ??= 0;
  estado.eventos ??= [];

  exigir(Array.isArray(estado.personagens), "personagens deve ser uma lista");
  exigir(estado.personagens.length > 1, "a simulação requer ao menos duas pessoas");

  const ids = new Set();
  for (const pessoa of estado.personagens) {
    exigir(typeof pessoa.id === "string" && pessoa.id, "personagem sem id");
    exigir(!ids.has(pessoa.id), `id de personagem duplicado: ${pessoa.id}`);
    ids.add(pessoa.id);
    pessoa.memoria ??= [];
    pessoa.percepcoes ??= {};
    pessoa.ambicao ??= 50;
    pessoa.ouro ??= 0;
    pessoa.soldados ??= 0;
    pessoa.legitimidade ??= 0;
  }

  const eventosIds = new Set();
  let maiorNumeroDeEvento = 0;
  for (const evento of estado.eventos) {
    exigir(typeof evento.id === "string" && evento.id, "evento sem id");
    exigir(!eventosIds.has(evento.id), `id de evento duplicado: ${evento.id}`);
    eventosIds.add(evento.id);
    const numero = /^evento_(\d+)$/.exec(evento.id)?.[1];
    if (numero) maiorNumeroDeEvento = Math.max(maiorNumeroDeEvento, Number(numero));
  }
  estado.proximo_evento ??= maiorNumeroDeEvento + 1;
  return estado;
}

export function personagem(estado, id) {
  const encontrado = estado.personagens.find((pessoa) => pessoa.id === id);
  exigir(encontrado, `personagem inexistente: ${id}`);
  return encontrado;
}

export function registrarEvento(estado, dados) {
  exigir(typeof dados.tipo === "string" && dados.tipo, "evento sem tipo");
  const envolvidos = new Set(dados.envolvidos ?? []);
  if (dados.autor) envolvidos.add(dados.autor);
  if (dados.alvo) envolvidos.add(dados.alvo);
  const conhecedores = new Set([...(dados.testemunhas ?? []), ...envolvidos]);
  for (const id of conhecedores) personagem(estado, id);

  for (const [observadorId, efeitos] of Object.entries(dados.impactos ?? {})) {
    personagem(estado, observadorId);
    for (const alvoId of Object.keys(efeitos)) personagem(estado, alvoId);
  }

  const evento = {
    id: `evento_${estado.proximo_evento++}`,
    turno: estado.turno,
    tipo: dados.tipo,
    autor: dados.autor ?? null,
    alvo: dados.alvo ?? null,
    envolvidos: [...envolvidos],
    publico: Boolean(dados.publico),
    impactos: copiar(dados.impactos ?? {}),
  };
  estado.eventos.push(evento);

  const destinatarios = evento.publico
    ? estado.personagens.map((pessoa) => pessoa.id)
    : [...conhecedores];

  for (const id of destinatarios) {
    const pessoa = personagem(estado, id);
    if (!pessoa.memoria.some((memoria) => memoria.evento_id === evento.id)) {
      pessoa.memoria.push({ evento_id: evento.id, impactos: copiar(evento.impactos[id] ?? {}) });
    }
  }
  return evento;
}

export function conheceEvento(estado, pessoaId, eventoId) {
  return personagem(estado, pessoaId).memoria.some(
    (memoria) => memoria.evento_id === eventoId,
  );
}

export function relacaoCom(estado, observadorId, alvoId) {
  const observador = personagem(estado, observadorId);
  const total = { confianca: 0, rancor: 0 };

  for (const memoria of observador.memoria) {
    const impacto = memoria.impactos[alvoId];
    if (!impacto) continue;
    total.confianca += impacto.confianca ?? 0;
    total.rancor += impacto.rancor ?? 0;
  }
  return total;
}

export function percepcaoDe(estado, observadorId, alvoId) {
  const observador = personagem(estado, observadorId);
  const alvo = personagem(estado, alvoId);
  if (observadorId === alvoId) {
    return { legitimidade: alvo.legitimidade, poder: calcularPoder(estado, alvoId) };
  }
  return copiar(observador.percepcoes[alvoId] ?? { legitimidade: 0, poder: null });
}

export function calcularPoder(estado, pessoaId) {
  const pessoa = personagem(estado, pessoaId);
  const territorios = (estado.regioes ?? []).filter(
    (regiao) => regiao.governante === pessoaId,
  ).length;
  return {
    territorios,
    soldados: pessoa.soldados,
    ouro: pessoa.ouro,
  };
}

function escolherAlvo(estado, ator) {
  return estado.personagens
    .filter((candidato) => candidato.id !== ator.id)
    .map((candidato) => {
      const relacao = relacaoCom(estado, ator.id, candidato.id);
      const percepcao = percepcaoDe(estado, ator.id, candidato.id);
      return {
        candidato,
        hostilidade: relacao.rancor - relacao.confianca + percepcao.legitimidade,
      };
    })
    .sort((a, b) => b.hostilidade - a.hostilidade || a.candidato.id.localeCompare(b.candidato.id))[0]
    .candidato;
}

export function decidirAcao(estado, atorId) {
  const ator = personagem(estado, atorId);
  const alvo = escolherAlvo(estado, ator);
  const relacao = relacaoCom(estado, ator.id, alvo.id);
  const percepcao = percepcaoDe(estado, ator.id, alvo.id);
  const ataquesAnteriores = estado.eventos.filter(
    (evento) => evento.tipo === "difamacao"
      && evento.autor === ator.id
      && evento.alvo === alvo.id,
  ).length;
  const desgastePolitico = ataquesAnteriores * 30;
  const desejoDeDifamar = ator.ambicao + relacao.rancor
    - relacao.confianca - desgastePolitico;

  if (desejoDeDifamar >= 80 && percepcao.legitimidade > 0) {
    return { tipo: "difamar", autor: ator.id, alvo: alvo.id };
  }
  return { tipo: "aguardar", autor: ator.id };
}

function executarAcao(estado, acao) {
  const autor = personagem(estado, acao.autor);
  if (acao.tipo === "aguardar") return null;

  exigir(acao.tipo === "difamar", `ação desconhecida: ${acao.tipo}`);
  const alvo = personagem(estado, acao.alvo);
  alvo.legitimidade = Math.max(0, alvo.legitimidade - 1);
  for (const observador of estado.personagens) {
    if (observador.id !== alvo.id && observador.percepcoes[alvo.id]) {
      observador.percepcoes[alvo.id].legitimidade = alvo.legitimidade;
    }
  }
  return registrarEvento(estado, {
    tipo: "difamacao",
    autor: autor.id,
    alvo: alvo.id,
    publico: true,
    impactos: {
      [alvo.id]: { [autor.id]: { rancor: 10, confianca: -5 } },
    },
  });
}

export function avancarTurno(estado) {
  estado.turno += 1;
  const decisoes = estado.personagens
    .map((pessoa) => decidirAcao(estado, pessoa.id));
  return decisoes.map((acao) => executarAcao(estado, acao)).filter(Boolean);
}
