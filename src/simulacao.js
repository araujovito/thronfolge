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
  estado.eleito ??= null;
  estado.encerrado ??= null;

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

export function memoriasSobre(estado, observadorId, alvoId) {
  const observador = personagem(estado, observadorId);
  return observador.memoria
    .filter((memoria) => memoria.impactos[alvoId])
    .map((memoria) => ({
      evento: estado.eventos.find((evento) => evento.id === memoria.evento_id),
      impacto: copiar(memoria.impactos[alvoId]),
    }))
    .filter((item) => item.evento);
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

export function apoiosDe(estado, pretendenteId) {
  personagem(estado, pretendenteId);
  return Object.entries(estado.apoios ?? {})
    .filter(([, apoiado]) => apoiado === pretendenteId)
    .map(([apoiador]) => apoiador);
}

export function pontuacaoParaApoio(estado, apoiadorId, pretendenteId) {
  const relacao = relacaoCom(estado, apoiadorId, pretendenteId);
  const percepcao = percepcaoDe(estado, apoiadorId, pretendenteId);
  return percepcao.legitimidade + relacao.confianca - relacao.rancor;
}

function alvoParaApoio(estado, ator) {
  const indiceAtor = estado.personagens.findIndex((pessoa) => pessoa.id === ator.id);
  const total = estado.personagens.length;
  return estado.personagens
    .filter((candidato) => candidato.id !== ator.id && estado.apoios[candidato.id] !== ator.id)
    .map((candidato) => ({
      candidato,
      pontuacao: pontuacaoParaApoio(estado, candidato.id, ator.id),
      distancia: (estado.personagens.findIndex((pessoa) => pessoa.id === candidato.id)
        - indiceAtor + total) % total,
    }))
    .sort((a, b) => b.pontuacao - a.pontuacao
      || a.distancia - b.distancia)[0] ?? null;
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
  if (estado.encerrado) return { tipo: "aguardar", autor: ator.id };
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

  if (desejoDeDifamar >= 100 && percepcao.legitimidade > 0) {
    return { tipo: "difamar", autor: ator.id, alvo: alvo.id };
  }
  if (estado.apoios) {
    const oportunidade = alvoParaApoio(estado, ator);
    if (oportunidade?.pontuacao >= 70) {
      return { tipo: "pedir_apoio", autor: ator.id, alvo: oportunidade.candidato.id };
    }
    if (oportunidade) {
      return { tipo: "conversar", autor: ator.id, alvo: oportunidade.candidato.id };
    }
  }
  return { tipo: "aguardar", autor: ator.id };
}

export function validarAcao(estado, acao) {
  const tipos = new Set(["aguardar", "conversar", "propor_amizade", "difamar",
    "pedir_apoio"]);
  if (estado.encerrado) return { valida: false, motivo: "a escolha do rei já terminou" };
  if (!tipos.has(acao.tipo)) return { valida: false, motivo: "ação desconhecida" };
  try {
    personagem(estado, acao.autor);
  } catch {
    return { valida: false, motivo: "autor inexistente" };
  }
  if (acao.tipo === "aguardar") return { valida: true, motivo: "" };
  if (!acao.alvo) return { valida: false, motivo: "escolha um alvo" };
  try {
    personagem(estado, acao.alvo);
  } catch {
    return { valida: false, motivo: "alvo inexistente" };
  }
  if (acao.autor === acao.alvo) {
    return { valida: false, motivo: "o personagem não pode ser o próprio alvo" };
  }
  if (acao.tipo === "pedir_apoio" && !estado.apoios) {
    return { valida: false, motivo: "o sistema de apoio não está ativo" };
  }
  if (acao.tipo === "pedir_apoio" && estado.apoios[acao.alvo] === acao.autor) {
    return { valida: false, motivo: "esse personagem já declarou apoio" };
  }
  return { valida: true, motivo: "" };
}

export function executarAcao(estado, acao) {
  const validacao = validarAcao(estado, acao);
  exigir(validacao.valida, validacao.motivo);
  const autor = personagem(estado, acao.autor);
  if (acao.tipo === "aguardar") return null;

  if (acao.tipo === "conversar") {
    return registrarEvento(estado, {
      tipo: "conversa",
      autor: autor.id,
      alvo: acao.alvo,
      impactos: {
        [autor.id]: { [acao.alvo]: { confianca: 2 } },
        [acao.alvo]: { [autor.id]: { confianca: 5 } },
      },
    });
  }

  if (acao.tipo === "propor_amizade") {
    const relacao = relacaoCom(estado, acao.alvo, autor.id);
    const percepcao = percepcaoDe(estado, acao.alvo, autor.id);
    const aceita = relacao.confianca - relacao.rancor + percepcao.legitimidade >= 40;
    return registrarEvento(estado, {
      tipo: aceita ? "amizade_aceita" : "amizade_recusada",
      autor: autor.id,
      alvo: acao.alvo,
      impactos: aceita ? {
        [autor.id]: { [acao.alvo]: { confianca: 15 } },
        [acao.alvo]: { [autor.id]: { confianca: 15 } },
      } : {},
    });
  }

  if (acao.tipo === "pedir_apoio") {
    const aceita = pontuacaoParaApoio(estado, acao.alvo, autor.id) >= 70;
    if (aceita) estado.apoios[acao.alvo] = autor.id;
    return registrarEvento(estado, {
      tipo: aceita ? "apoio_concedido" : "apoio_recusado",
      autor: autor.id,
      alvo: acao.alvo,
      publico: aceita,
      impactos: aceita ? {
        [autor.id]: { [acao.alvo]: { confianca: 10 } },
        [acao.alvo]: { [autor.id]: { confianca: 10 } },
      } : {},
    });
  }

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
  return resolverTurno(estado);
}

export function resolverTurno(estado, acaoJogador = null, jogadorId = null) {
  exigir(!estado.encerrado, "a escolha do rei já terminou");
  if (acaoJogador) {
    exigir(acaoJogador.autor === jogadorId, "a ação não pertence ao jogador");
    const validacao = validarAcao(estado, acaoJogador);
    exigir(validacao.valida, validacao.motivo);
  }

  estado.turno += 1;
  const eventos = [];
  if (acaoJogador) {
    const evento = executarAcao(estado, acaoJogador);
    if (evento) eventos.push(evento);
  }
  const decisoes = estado.personagens
    .filter((pessoa) => pessoa.id !== jogadorId)
    .map((pessoa) => decidirAcao(estado, pessoa.id));
  for (const decisao of decisoes) {
    const evento = executarAcao(estado, decisao);
    if (evento) eventos.push(evento);
  }
  if (!estado.eleito && estado.apoios) {
    const vencedor = estado.personagens
      .map((pessoa) => ({ pessoa, total: apoiosDe(estado, pessoa.id).length }))
      .filter((item) => item.total >= 3)
      .sort((a, b) => b.total - a.total || a.pessoa.id.localeCompare(b.pessoa.id))[0];
    if (vencedor) {
      estado.eleito = vencedor.pessoa.id;
      estado.encerrado = "rei_eleito";
      eventos.push(registrarEvento(estado, {
        tipo: "eleicao_regia",
        alvo: vencedor.pessoa.id,
        publico: true,
      }));
    }
  }
  if (!estado.encerrado && estado.turno >= 24) {
    estado.encerrado = "sem_consenso";
    eventos.push(registrarEvento(estado, {
      tipo: "fim_sem_consenso",
      publico: true,
    }));
  }
  return eventos;
}
