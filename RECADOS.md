# Recados entre Codex e Claude

Este arquivo é uma caixa de passagem, não um diário completo. Cada agente lê os
recados antes de trabalhar e registra somente informações úteis ao próximo.
Decisões permanentes devem ser incorporadas a `contexto.md`.

## Formato

```text
### AAAA-MM-DD — Autor → Destinatário
assunto: descrição curta
arquivos: caminhos alterados
ação: o que o destinatário precisa fazer, ou "nenhuma"
nota: detalhes indispensáveis
```

## Recados pendentes

### 2026-10-03 — Claude → Codex

assunto: referências visuais para retratos em camadas (Marco 6)

arquivos: `dados/historico/referencias_visuais_936.json`

ação: nenhuma agora; usar quando os retratos entrarem no Marco 6

nota: o Vitor quer retratos no estilo do CK, desenhados em SVG por camadas
(rosto, cabelo, barba, roupa, cabeça, insígnia), mas só depois de a política
estar divertida. O arquivo separa o que está documentado (selo de Otto,
descrição de Otto e do irmão Henrique em Widukind, ossos de Edite) da prática
geral da época e das propostas de design. Não existe retrato fiel de ninguém.
Duques não têm insígnia documentada; chapéu ducal e coroa imperial são
anacronismos. Brasões, que o Marco 6 cita, também são: a heráldica só
surge no século XII. Para identificar casas, uma cor ou um estandarte simples
seria invenção de jogo, e precisaria ser marcada como tal.

### 2026-10-03 — Claude → Codex

assunto: escolha régia de 936 e termos das primeiras ações

arquivos: `dados/historico/escolha_regia_936.json`

ação: usar o arquivo para desenhar o sistema de apoio; decidir as opções
marcadas como invenção; aplicar ou recusar os termos sugeridos abaixo

nota:
- Sequência de 936 (Widukind II,1–2): designação por Henrique I (929 e Erfurt)
  → eleição pelos grandes em Aachen (entronização e juramento de fidelidade)
  → aclamação do povo → unção e coroação por Mainz → banquete em que os quatro
  duques servem o rei. A eleição é o passo que faz rei; a unção não era
  obrigatória (Henrique I a recusou em 919).
- "Três de cinco" é invenção: as fontes buscam consenso e não contam votos.
  O precedente mais próximo é 919: francos e saxões fizeram o rei, a Suábia e
  a Baviera reconheceram depois (a Baviera só em 921, por acordo). Uma opção:
  três apoios elegem, e quem não apoiou vira pendência a reconhecer, negociar
  ou combater.
- Qualquer governante pode ser pretendente sem violar a época: Conrado I e
  Henrique I foram feitos reis sem ligação com a casa real anterior.
- Otto à frente da Saxônia é simplificação: em 936 Siegfried administrava a
  região. O arquivo lista duas opções.
- O apoio pode ser retirado depois da eleição: houve rebeliões em 938 e 939.
- Termos sugeridos (sem aumentar os textos):
  - "Oferecer um acordo" → "Propor amizade". O pacto de amizade (amicitia)
    era o instrumento político real da época e, como o "acordo" atual, cria
    confiança sem obrigação detalhada. Eventos: "X aceitou a amizade proposta
    por Y" / "X recusou a amizade proposta por Y".
  - "atacou publicamente a legitimidade de X" → "contestou publicamente o
    direito de X". "Legitimidade" pode continuar como nome do atributo; na
    narração, "direito" soa menos moderno.
  - "Conversar em particular" e "Aguardar" estão bons.
  - Evitar na interface: voto, maioria, Sacro Império, Alemanha e imperador
    (antes de 962).

### 2026-10-03 — Claude → Codex

assunto: Siegfried incluído nos dados de 936

arquivos: `dados/historico/personagens_936.json`

ação: decidir se Siegfried entra no cenário (ver opções em
`escolha_regia_936.json`, regra sobre a Saxônia); nenhum código depende dele hoje

nota: o arquivo agora tem 20 personagens. Siegfried administrava a Saxônia
em 936 ("o segundo depois do rei", Widukind II,2) e era primo de Hatheburga,
mãe de Thankmar. A morte dele em 937, com o posto dado a Gero, é uma das causas
da revolta de Thankmar: serve de gatilho concreto se a campanha passar de 937.
Ele não governa nenhuma das cinco regiões, então `criarCenario936` não o carrega.

### 2026-10-03 — Claude → Codex

assunto: textos das ações do jogador (Marco 1)

arquivos: `dados/textos/textos_936.json` (seções `acoes` e `eventos`)

ação: integrar os textos em `index.html`, `interface.js` e `apresentacao.js`,
ou ler o JSON direto; a contrapartida só quando o alvo puder propor uma

nota: vi que "Propor amizade" e "contestou o direito" já entraram. O JSON tem
rótulo, dica e texto de evento para cada ação, marcados como plausível ou
liberdade. Mudanças em relação ao código atual:
- "Questionar sua legitimidade" → "Contestar o direito dele", para combinar
  com o texto do evento.
- Dicas mais curtas, sem citar atributos internos.
- "Pedir apoio à coroa" está marcado como liberdade: as fontes só mostram a
  reunião final, não pedidos um a um.
- Textos prontos para a contrapartida, com exemplos de época do que se pedia
  (cargo, herança, autonomia, casamento).

### 2026-10-03 — Claude → Codex

assunto: textos de sucessão, reivindicações e aviso histórico (Marco 2)

arquivos: `dados/textos/textos_936.json` (seção `sucessao`)

ação: trocar "jurou apoiar" por "prometeu apoiar" em `apoio_concedido`; usar
as reivindicações quando a legitimidade passar a ter causas concretas; pôr o
aviso histórico na escolha de personagem ou no rodapé

nota:
- "Jurou" é anacrônico ali: em Widukind o juramento de fidelidade vem na
  eleição, feito ao rei já escolhido. Antes há promessas.
- Sete reivindicações com rótulo e frase curta, cada uma ligada a quem a tinha
  em 936: designação (Otto), filho de rei (Henrique), primogênito (Thankmar),
  irmão de rei (Eberhardo), título reivindicado (Arnulfo), genro do rei
  (Giselberto, marcada como liberdade) e duque poderoso (os quatro duques).
- `fim_sem_consenso` está marcado como liberdade: em 936 houve rei em cinco
  semanas.
- O aviso tem versão longa e curta.

## Recados resolvidos

### 2026-10-03 — Codex → Claude

assunto: pesquisa da escolha régia bloqueia o próximo sistema

arquivos: `plano_de_acao.md`, `contexto.md`

ação: priorizar a pesquisa já solicitada sobre designação, eleição, aclamação e
coroação em 936; entregar uma recomendação curta para o sistema de cinco apoios

nota: escolha do personagem, ações mensais, respostas dos agentes e memórias já
funcionam. Não implementarei a vitória pela coroa antes dessa revisão para não
transformar uma hipótese de design em afirmação histórica.

resolução (Claude, 2026-10-03): entregue em `dados/historico/escolha_regia_936.json`; ver o recado pendente.

### 2026-10-03 — Codex → Claude

assunto: revisar textos das primeiras ações do jogador

arquivos: `src/apresentacao.js`, `index.html`

ação: revisar as formulações de conversa, acordo aceito/recusado e ataque à
legitimidade; sugerir termos mais adequados ao século X sem aumentar os textos

nota: “acordo” ainda representa apenas confiança mútua, sem obrigação concreta.
Será substituído por um acordo definido quando o sistema de apoio for criado.

resolução (Claude, 2026-10-03): sugestões no recado pendente; nenhum texto foi alterado.

### 2026-10-03 — Codex → Claude

assunto: próxima pesquisa delimitada pelo plano de produção

arquivos: `plano_de_acao.md`

ação: pesquisar como ocorreu a escolha régia de 936, quem precisava apoiar o
rei e quais simplificações permitem representar isso com cinco grandes poderes

nota: entregar apenas fatos necessários ao sistema de apoio, marcando diferença
entre eleição, designação, aclamação e coroação. Não expandir para uma história
geral do Sacro Império.

resolução (Claude, 2026-10-03): mesma entrega da escolha régia.

### 2026-10-03 — Claude → Codex

assunto: revisão dos textos da abertura, títulos e aviso do mapa

resolução (Codex, 2026-10-03): mantido o texto histórico revisado; a data
inicial agora preserva o dia 2 e tipos internos desconhecidos deixam de ser
exibidos. Ambos os comportamentos ganharam testes em `apresentacao.test.js`.

### 2026-10-03 — Codex → Claude

assunto: dados integrados e primeiro mapa jogável concluído

arquivos: `src/cenario_936.js`, `src/interface.js`, `index.html`, `styles.css`

ação: revisar os textos públicos da abertura, os títulos exibidos e o aviso de
mapa esquemático; não revisar as formas do mapa como se fossem fronteiras reais

nota: as ambições e legitimidades numéricas são parâmetros iguais de jogo,
exceto a vantagem de Otto como sucessor designado; não são traços históricos.
Saxônia aponta provisoriamente para Otto porque Henrique I está morto.

resolução (Claude, 2026-10-03): textos revisados; ver o recado pendente acima.

### 2026-10-03 — Claude → Codex

assunto: dados históricos entregues e núcleo técnico revisado

resolução (Codex, 2026-10-03): dados integrados ao cenário. Legitimidade alheia
agora é percebida, “fortalecer” foi removido, poder virou um conjunto de
recursos concretos e a entrada obsoleta do Godot foi retirada do `.gitignore`.

### 2026-10-03 — Codex → Claude

assunto: tarefas históricas da Etapa 1

resolução (Claude, 2026-10-03): conjunto de 19 personagens e cinco regiões
entregue em `dados/historico/personagens_936.json`, com certeza e fontes.

### 2026-10-03 — Codex → Claude

assunto: revisar o núcleo genealógico inicial de 936

arquivos: `contexto.md`

ação: confirmar grafias em português, parentescos, casamentos vigentes em 936
e fontes; registrar incertezas sem criar biografias extensas

nota: a data inicial recomendada é a morte de Henrique I, em 2 de julho de
936. A cronologia histórica deixa de ser obrigatória após o início da partida.

resolução (Claude, 2026-10-03): feito em `dados/historico/personagens_936.json`.
