# Thronfolge

Jogo de estratégia política em mapa, ambientado no começo da formação do
Sacro Império Romano-Germânico. A campanha começa em 936, após a morte do rei
Henrique I. A genealogia, os nomes e a situação inicial partem de fontes
históricas; depois do início da partida, personagens e facções agem de forma
autônoma e criam uma história alternativa.

O projeto prioriza baixo custo de desenvolvimento e de execução. A primeira
versão usará regras determinísticas para política, memória e decisões. Modelos
de linguagem locais só serão avaliados depois que o protótipo estiver jogável.

## Documentos do projeto

- [`contexto.md`](contexto.md): visão, decisões e fatos que precisam sobreviver
  entre sessões.
- [`AGENTS.md`](AGENTS.md): instruções de trabalho para o Codex.
- [`CLAUDE.md`](CLAUDE.md): instruções de trabalho para o Claude.
- [`RECADOS.md`](RECADOS.md): entregas e avisos recentes entre os agentes.
- [`plano_de_acao.md`](plano_de_acao.md): roteiro único de implementação e
  pesquisa.

## Desenvolvimento

O núcleo inicial usa JavaScript moderno sem bibliotecas externas. Isso mantém a
simulação separada da interface e permite validá-la com o Node já disponível:

```sh
node --test
node servidor.js
```

Depois, abra `http://127.0.0.1:8080`. O servidor local é necessário porque o
navegador carrega os dados históricos em JSON. Nenhuma conexão externa é feita.

## Estado atual

O núcleo de acontecimentos, conhecimento individual, memórias, relações e um
primeiro turno determinístico está implementado, com um mapa esquemático
jogável dos cinco ducados de 936.
