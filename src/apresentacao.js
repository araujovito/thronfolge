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
    difamacao: () => `${nome(evento.autor)} atacou publicamente a legitimidade de ${nome(evento.alvo)}.`,
    conversa: () => `${nome(evento.autor)} conversou em particular com ${nome(evento.alvo)}.`,
    acordo_aceito: () => `${nome(evento.alvo)} aceitou um acordo proposto por ${nome(evento.autor)}.`,
    acordo_recusado: () => `${nome(evento.alvo)} recusou um acordo proposto por ${nome(evento.autor)}.`,
  };
  return nomes[evento.tipo]?.() ?? null;
}

