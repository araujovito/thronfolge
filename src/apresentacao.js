const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

export function dataDoTurno(turno) {
  const indice = 6 + turno;
  const mesEAno = `${MESES[indice % 12]} de ${936 + Math.floor(indice / 12)}`;
  return turno === 0 ? `2 de ${mesEAno}` : mesEAno;
}

export function descreverEvento(evento, nome) {
  const nomes = {
    morte_do_rei: () => "Henrique I morreu em Memleben. Designou Otto como sucessor, mas os grandes ainda não o elegeram.",
    difamacao: () => `${nome(evento.autor)} contestou publicamente o direito de ${nome(evento.alvo)}.`,
    conversa: () => `${nome(evento.autor)} conversou a sós com ${nome(evento.alvo)}.`,
    amizade_aceita: () => `${nome(evento.alvo)} aceitou a amizade de ${nome(evento.autor)}.`,
    amizade_recusada: () => `${nome(evento.alvo)} recusou a amizade de ${nome(evento.autor)}.`,
    apoio_concedido: () => `${nome(evento.alvo)} jurou apoiar ${nome(evento.autor)} na escolha régia.`,
    apoio_recusado: () => `${nome(evento.alvo)} recusou apoiar ${nome(evento.autor)}.`,
    eleicao_regia: () => `Os grandes fizeram ${nome(evento.alvo)} rei e juraram-lhe fidelidade.`,
    fim_sem_consenso: () => "Os grandes não chegaram a um consenso antes do fim da campanha.",
  };
  return nomes[evento.tipo]?.() ?? null;
}
