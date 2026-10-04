# Plano de ação

Este é o roteiro único do trabalho futuro. Cada etapa termina em algo testável;
não se começa a etapa seguinte apenas para preencher estrutura.

## Princípios de julgamento

- Validar a diversão da política antes de produzir arte ou ampliar o mapa.
- História documentada inicializa o mundo; regras simuladas decidem o futuro.
- Toda informação pertence a alguém: o estado verdadeiro não é conhecimento
  automático dos personagens.
- Começar sem dependências externas, serviços pagos ou LLM em tempo de jogo.
- Não criar dezenas de atributos quando um acontecimento concreto explica a
  relação entre duas pessoas.

## Etapa 1 — Núcleo verificável

**Codex**

- [x] Escolher uma tecnologia executável no ambiente atual.
- [x] Criar estado de mundo independente da interface.
- [x] Implementar acontecimentos, testemunhas e memórias individuais.
- [x] Derivar confiança e rancor das memórias, sem reputação global.
- [x] Implementar um primeiro turno determinístico de decisões.
- [x] Cobrir isolamento de informação e determinismo com testes.
- [x] Submeter as regras de utilidade a partidas simuladas e ajustar excessos.

**Claude**

- [x] Revisar a família liudolfinga existente em `contexto.md`.
- [x] Entregar o primeiro conjunto histórico em formato curto: pessoa, nomes,
  pais, cônjuges vigentes em julho de 936, título, data e fontes
  (`dados/historico/personagens_936.json`).
- [x] Separar fatos, datas aproximadas e hipóteses historiográficas.
- [x] Revisar os textos públicos da abertura sem transformar inferências em
  fatos.

**Critério de conclusão**

Uma simulação pequena roda repetidamente com o mesmo resultado; um personagem
não reage a um acontecimento que não conhece; relações podem ser explicadas por
uma lista de memórias.

## Etapa 2 — Primeiro mapa jogável

**Codex**

- [x] Criar a interface web sem bibliotecas externas.
- [x] Exibir um mapa esquemático de cinco ducados, claramente provisório.
- [x] Permitir selecionar região e personagem e avançar um mês.
- [x] Mostrar notícias públicas e memórias conhecidas pelo personagem do
  jogador.
- [x] Salvar e carregar uma partida localmente.

**Claude**

- [x] Validar quais entidades políticas devem aparecer no recorte de 936.
- [x] Fornecer governantes e vínculos necessários, sem biografias completas.
- [x] Revisar nomes, títulos e avisos de simplificação histórica da interface.

**Critério de conclusão**

O jogador entende quem controla cada região, avança doze turnos e consegue
explicar por que ao menos uma relação política mudou.

## Etapa 3 — Disputa pela coroa

**Codex**

- [ ] Implementar legitimidade, apoio dos grandes e eleição/aclamação.
- [ ] Adicionar ações de negociar, ameaçar, difamar, espionar e mobilizar.
- [ ] Validar recursos, conhecimento e alcance de cada ação.
- [ ] Criar condição de vitória provisória e relatório de fim de campanha.

**Claude**

- [ ] Revisar o que “sucessão” e “realeza” significam nesse recorte.
- [ ] Preparar linguagem curta para juramentos, reivindicações e recusas.
- [ ] Marcar liberdades de design necessárias para tornar o sistema legível.

**Critério de conclusão**

Uma campanha completa possui vencedor sem evento roteirizado e produz caminhos
diferentes quando decisões iniciais mudam.

## Etapa 4 — Profundidade e apresentação

Só entra depois de a etapa 3 ser divertida. Inclui rumores distorcidos,
casamentos, sucessão familiar, guerra, mapa historicamente melhor, arte, áudio e
possível empacotamento para desktop. Um modelo local só será testado aqui e
precisará superar regras determinísticas numa avaliação controlada.
