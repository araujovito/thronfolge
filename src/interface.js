import { carregarCenario936 } from "./cenario_936.js";
import { dataDoTurno, descreverEvento } from "./apresentacao.js";
import {
  calcularPoder,
  criarEstado,
  memoriasSobre,
  personagem,
  relacaoCom,
  resolverTurno,
  validarAcao,
} from "./simulacao.js";

const CHAVE_SAVE = "thronfolge-prototipo-v2";

let estado;
let jogadorId = null;
let alvoId = null;

function nome(id) {
  return personagem(estado, id).nome;
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
    botao.setAttribute("aria-pressed", String(governante.id === alvoId));
    const voce = governante.id === jogadorId ? " · você" : "";
    botao.innerHTML = `<strong>${regiao.nome}</strong><small>${governante.nome}${voce}</small>`;
    botao.addEventListener("click", () => {
      if (governante.id === jogadorId) return;
      alvoId = governante.id;
      renderizar();
    });
    mapa.append(botao);
  }
}

function renderizarPersonagem() {
  const id = jogadorId ?? "otto";
  const pessoa = personagem(estado, id);
  const poder = calcularPoder(estado, id);
  document.querySelector("#nome-personagem").textContent = pessoa.nome;
  document.querySelector("#titulo-personagem").textContent = pessoa.titulo;
  document.querySelector("#legitimidade").textContent = pessoa.legitimidade;
  document.querySelector("#territorios").textContent = poder.territorios;
  document.querySelector("#total-memorias").textContent = pessoa.memoria.length;

  const relacoes = document.querySelector("#relacoes");
  relacoes.replaceChildren();
  for (const outro of estado.personagens.filter((item) => item.id !== id)) {
    const valores = relacaoCom(estado, id, outro.id);
    const lembrancas = memoriasSobre(estado, id, outro.id)
      .map((item) => descreverEvento(item.evento, nome))
      .filter(Boolean)
      .slice(-3)
      .reverse();
    const linha = document.createElement("details");
    linha.className = "relacao";
    const explicacao = lembrancas.length > 0
      ? `<ul>${lembrancas.map((texto) => `<li>${texto}</li>`).join("")}</ul>`
      : "<p>Nenhuma memória alterou esta relação.</p>";
    linha.innerHTML = `<summary><strong>${outro.nome}</strong><span>confiança ${valores.confianca} · rancor ${valores.rancor}</span></summary>${explicacao}`;
    relacoes.append(linha);
  }
}

function renderizarNoticias() {
  const pessoa = personagem(estado, jogadorId ?? "otto");
  const conhecidos = new Set(pessoa.memoria.map((memoria) => memoria.evento_id));
  const eventos = estado.eventos
    .filter((evento) => conhecidos.has(evento.id))
    .map((evento) => ({ evento, descricao: descreverEvento(evento, nome) }))
    .filter((item) => item.descricao)
    .reverse();
  const lista = document.querySelector("#noticias");
  lista.replaceChildren();
  for (const { evento, descricao } of eventos) {
    const item = document.createElement("li");
    item.innerHTML = `<time>${dataDoTurno(evento.turno)}</time><br>${descricao}`;
    lista.append(item);
  }
  if (eventos.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Nenhum relato conhecido.";
    lista.append(item);
  }
}

function acaoAtual() {
  const tipo = document.querySelector("#acao").value;
  return {
    tipo,
    autor: jogadorId,
    ...(tipo === "aguardar" ? {} : { alvo: alvoId }),
  };
}

function atualizarPrevisao() {
  if (!jogadorId) return;
  const textos = {
    conversar: "Uma conversa privada pode aumentar a confiança entre os dois personagens.",
    oferecer_acordo: "A resposta dependerá da confiança, do rancor e da legitimidade que o alvo percebe.",
    difamar: "A acusação será pública, reduzirá a legitimidade do alvo e poderá criar rancor.",
    aguardar: "Você não realizará ação política neste mês.",
  };
  const acao = acaoAtual();
  const validacao = validarAcao(estado, acao);
  document.querySelector("#previsao-acao").textContent = validacao.valida
    ? textos[acao.tipo]
    : validacao.motivo;
  document.querySelector("#confirmar-acao").disabled = !validacao.valida;
}

function renderizarAcoes() {
  const seletor = document.querySelector("#alvo");
  seletor.replaceChildren();
  for (const pessoa of estado.personagens.filter((item) => item.id !== jogadorId)) {
    const opcao = document.createElement("option");
    opcao.value = pessoa.id;
    opcao.textContent = pessoa.nome;
    opcao.selected = pessoa.id === alvoId;
    seletor.append(opcao);
  }
  seletor.disabled = document.querySelector("#acao").value === "aguardar";
  atualizarPrevisao();
}

function renderizar() {
  document.querySelector("#data").textContent = dataDoTurno(estado.turno);
  renderizarMapa();
  renderizarPersonagem();
  renderizarNoticias();
  renderizarAcoes();
}

function informar(mensagem) {
  document.querySelector("#estado-save").textContent = mensagem;
}

function escolherPersonagem() {
  const opcoes = document.querySelector("#opcoes-personagem");
  opcoes.replaceChildren();
  for (const pessoa of estado.personagens) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcao-personagem";
    botao.innerHTML = `<strong>${pessoa.nome}</strong><span>${pessoa.titulo}</span>`;
    botao.addEventListener("click", () => {
      jogadorId = pessoa.id;
      alvoId = estado.personagens.find((item) => item.id !== jogadorId).id;
      document.querySelector("#escolha-personagem").close();
      renderizar();
    });
    opcoes.append(botao);
  }
  document.querySelector("#escolha-personagem").showModal();
}

async function iniciar() {
  estado = await carregarCenario936();
  renderizar();
  escolherPersonagem();

  document.querySelector("#confirmar-acao").addEventListener("click", () => {
    resolverTurno(estado, acaoAtual(), jogadorId);
    renderizar();
    informar("");
  });
  document.querySelector("#alvo").addEventListener("change", (evento) => {
    alvoId = evento.target.value;
    renderizar();
  });
  document.querySelector("#acao").addEventListener("change", renderizarAcoes);
  document.querySelector("#salvar").addEventListener("click", () => {
    localStorage.setItem(CHAVE_SAVE, JSON.stringify({ estado, jogadorId, alvoId }));
    informar("Partida salva neste navegador.");
  });
  document.querySelector("#carregar").addEventListener("click", () => {
    const salvo = localStorage.getItem(CHAVE_SAVE);
    if (!salvo) return informar("Nenhuma partida salva foi encontrada.");
    const dados = JSON.parse(salvo);
    estado = criarEstado(dados.estado);
    jogadorId = estado.personagens.some((pessoa) => pessoa.id === dados.jogadorId)
      ? dados.jogadorId
      : "otto";
    alvoId = estado.personagens.some(
      (pessoa) => pessoa.id === dados.alvoId && pessoa.id !== jogadorId,
    ) ? dados.alvoId : estado.personagens.find((pessoa) => pessoa.id !== jogadorId).id;
    renderizar();
    informar("Partida carregada.");
  });
  document.querySelector("#reiniciar").addEventListener("click", async () => {
    estado = await carregarCenario936();
    jogadorId = null;
    alvoId = null;
    renderizar();
    informar("Campanha reiniciada.");
    escolherPersonagem();
  });
}

iniciar().catch((erro) => {
  document.body.innerHTML = `<main class="painel"><h1>Falha ao iniciar</h1><p>${erro.message}</p></main>`;
});
