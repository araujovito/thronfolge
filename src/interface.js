import { carregarCenario936 } from "./cenario_936.js";
import {
  avancarTurno,
  calcularPoder,
  criarEstado,
  personagem,
  relacaoCom,
} from "./simulacao.js";

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const CHAVE_SAVE = "thronfolge-prototipo-v1";

let estado;
let selecionado = "otto";

function dataDoTurno(turno) {
  const indice = 6 + turno;
  return `${MESES[indice % 12]} de ${936 + Math.floor(indice / 12)}`;
}

function nome(id) {
  return personagem(estado, id).nome;
}

function descreverEvento(evento) {
  if (evento.tipo === "morte_do_rei") {
    return "Henrique I morreu em Memleben. Designou Otto como sucessor, mas os grandes ainda não o elegeram.";
  }
  if (evento.tipo === "difamacao") {
    return `${nome(evento.autor)} atacou publicamente a legitimidade de ${nome(evento.alvo)}.`;
  }
  return `Acontecimento registrado: ${evento.tipo}.`;
}

function renderizarMapa() {
  const mapa = document.querySelector("#mapa");
  mapa.replaceChildren();
  for (const regiao of estado.regioes) {
    const governante = personagem(estado, regiao.governante);
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "regiao";
    botao.dataset.id = regiao.id;
    botao.setAttribute("aria-pressed", String(governante.id === selecionado));
    botao.innerHTML = `<strong>${regiao.nome}</strong><small>${governante.nome}</small>`;
    botao.addEventListener("click", () => {
      selecionado = governante.id;
      renderizar();
    });
    mapa.append(botao);
  }
}

function renderizarPersonagem() {
  const pessoa = personagem(estado, selecionado);
  const poder = calcularPoder(estado, selecionado);
  document.querySelector("#nome-personagem").textContent = pessoa.nome;
  document.querySelector("#titulo-personagem").textContent = pessoa.titulo;
  document.querySelector("#legitimidade").textContent = pessoa.legitimidade;
  document.querySelector("#territorios").textContent = poder.territorios;
  document.querySelector("#total-memorias").textContent = pessoa.memoria.length;

  const relacoes = document.querySelector("#relacoes");
  relacoes.replaceChildren();
  for (const outro of estado.personagens.filter((item) => item.id !== selecionado)) {
    const valores = relacaoCom(estado, selecionado, outro.id);
    const linha = document.createElement("div");
    linha.className = "relacao";
    linha.innerHTML = `<strong>${outro.nome}</strong><span>confiança ${valores.confianca} · rancor ${valores.rancor}</span>`;
    relacoes.append(linha);
  }
}

function renderizarNoticias() {
  const pessoa = personagem(estado, selecionado);
  const conhecidos = new Set(pessoa.memoria.map((memoria) => memoria.evento_id));
  const eventos = estado.eventos.filter((evento) => conhecidos.has(evento.id)).reverse();
  const lista = document.querySelector("#noticias");
  lista.replaceChildren();
  for (const evento of eventos) {
    const item = document.createElement("li");
    item.innerHTML = `<time>${dataDoTurno(evento.turno)}</time><br>${descreverEvento(evento)}`;
    lista.append(item);
  }
  if (eventos.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Nenhum relato conhecido.";
    lista.append(item);
  }
}

function renderizar() {
  document.querySelector("#data").textContent = dataDoTurno(estado.turno);
  renderizarMapa();
  renderizarPersonagem();
  renderizarNoticias();
}

function informar(mensagem) {
  document.querySelector("#estado-save").textContent = mensagem;
}

async function iniciar() {
  estado = await carregarCenario936();
  renderizar();

  document.querySelector("#avancar").addEventListener("click", () => {
    avancarTurno(estado);
    renderizar();
    informar("");
  });
  document.querySelector("#salvar").addEventListener("click", () => {
    localStorage.setItem(CHAVE_SAVE, JSON.stringify({ estado, selecionado }));
    informar("Partida salva neste navegador.");
  });
  document.querySelector("#carregar").addEventListener("click", () => {
    const salvo = localStorage.getItem(CHAVE_SAVE);
    if (!salvo) return informar("Nenhuma partida salva foi encontrada.");
    const dados = JSON.parse(salvo);
    estado = criarEstado(dados.estado);
    selecionado = estado.personagens.some((pessoa) => pessoa.id === dados.selecionado)
      ? dados.selecionado
      : "otto";
    renderizar();
    informar("Partida carregada.");
  });
  document.querySelector("#reiniciar").addEventListener("click", async () => {
    estado = await carregarCenario936();
    selecionado = "otto";
    renderizar();
    informar("Campanha reiniciada.");
  });
}

iniciar().catch((erro) => {
  document.body.innerHTML = `<main class="painel"><h1>Falha ao iniciar</h1><p>${erro.message}</p></main>`;
});
