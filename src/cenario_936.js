import { criarEstado, registrarEvento } from "./simulacao.js";

const GOVERNANTES_JOGAVEIS = {
  saxonia: "otto",
  francia: "eberhardo",
  baviera: "arnulfo",
  suabia: "hermano_suabia",
  lotaringia: "giselberto",
};

export function criarCenario936(dadosHistoricos) {
  const porId = Object.fromEntries(
    dadosHistoricos.personagens.map((pessoa) => [pessoa.id, pessoa]),
  );
  const regioes = dadosHistoricos.regioes_936.map((regiao) => ({
    ...regiao,
    governante: GOVERNANTES_JOGAVEIS[regiao.id] ?? regiao.governante,
  }));
  const ids = [...new Set(regioes.map((regiao) => regiao.governante))];

  const personagens = ids.map((id) => {
    const historico = porId[id];
    if (!historico) throw new Error(`governante sem ficha histórica: ${id}`);
    const percepcoes = Object.fromEntries(
      ids.filter((outroId) => outroId !== id).map((outroId) => [
        outroId,
        { legitimidade: outroId === "otto" ? 60 : 45, poder: null },
      ]),
    );
    return {
      id,
      nome: historico.nome,
      nome_historico: historico.nome_historico,
      titulo: historico.titulos_em_936[0] ?? "nobre",
      ambicao: 80,
      legitimidade: id === "otto" ? 60 : 45,
      percepcoes,
      memoria: [],
      ouro: 0,
      soldados: 0,
    };
  });

  const estado = criarEstado({
    data_inicial: [936, 7, 2],
    personagens,
    regioes,
  });
  registrarEvento(estado, {
    tipo: "morte_do_rei",
    alvo: "otto",
    publico: true,
  });
  return estado;
}

export async function carregarCenario936(caminho = "./dados/historico/personagens_936.json") {
  const resposta = await fetch(caminho);
  if (!resposta.ok) throw new Error(`não foi possível carregar o cenário (${resposta.status})`);
  return criarCenario936(await resposta.json());
}

