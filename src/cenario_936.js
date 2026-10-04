import { criarEstado, registrarEvento } from "./simulacao.js";

const GOVERNANTES_JOGAVEIS = {
  saxonia: "otto",
  francia: "eberhardo",
  baviera: "arnulfo",
  suabia: "hermano_suabia",
  lotaringia: "giselberto",
};

export function criarCenario936(dadosHistoricos, dadosEscolha = {}) {
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
      argumento_legitimidade: dadosEscolha.argumentos_de_legitimidade?.[id]?.argumento ?? null,
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
    apoios: Object.fromEntries(ids.map((id) => [id, id])),
  });
  registrarEvento(estado, {
    tipo: "morte_do_rei",
    alvo: "otto",
    publico: true,
  });
  return estado;
}

export async function carregarCenario936(
  caminhoPessoas = "./dados/historico/personagens_936.json",
  caminhoEscolha = "./dados/historico/escolha_regia_936.json",
) {
  const [respostaPessoas, respostaEscolha] = await Promise.all([
    fetch(caminhoPessoas),
    fetch(caminhoEscolha),
  ]);
  if (!respostaPessoas.ok || !respostaEscolha.ok) {
    throw new Error("não foi possível carregar os dados históricos do cenário");
  }
  return criarCenario936(await respostaPessoas.json(), await respostaEscolha.json());
}
