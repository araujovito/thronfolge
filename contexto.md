# Contexto permanente — Thronfolge

Este é o resumo canônico do projeto. Deve permanecer curto. Ele registra
decisões confirmadas, não conversas completas nem ideias ainda especulativas.

## Visão

`Thronfolge` é um jogo de estratégia política em mapa, inspirado na escala de
mapa e personagens de Crusader Kings, mas com escopo muito menor. O centro do
jogo é a disputa pelo trono entre personagens e facções que possuem objetivos,
relações, conhecimento parcial e memórias de acontecimentos concretos.

## Premissa histórica

- Início pretendido: 2 de julho de 936, após a morte de Henrique I.
- Espaço: Reino Franco Oriental, durante a formação do reino germânico que
  posteriormente integraria o Sacro Império Romano-Germânico.
- A coroação imperial de Otto em 962 não é garantida na simulação.
- Nomes, parentescos, títulos, datas e situação inicial devem usar fontes
  históricas identificadas.
- A história serve somente para inicializar a campanha. Após o primeiro turno,
  a simulação pode divergir completamente da cronologia real.

Fontes iniciais consultadas:

- Deutsche Biographie, Henrique I:
  https://www.deutsche-biographie.de/gnd11854831X.html
- Deutsche Biographie, Otto I:
  https://www.deutsche-biographie.de/sfz74082.html
- Deutsche Biographie, Liudolfingas/Otônidas:
  https://www.deutsche-biographie.de/sfz51986.html

## Núcleo familiar inicial confirmado

- Henrique I: rei falecido que desencadeia a sucessão.
- Hatheburga: primeira esposa de Henrique I; mãe de Thankmar.
- Matilde de Ringelheim: segunda esposa de Henrique I.
- Thankmar: filho de Henrique I e Hatheburga; meio-irmão de Otto.
- Otto: filho de Henrique I e Matilde; sucessor designado.
- Henrique: irmão mais novo de Otto.
- Bruno: irmão de Otto, ligado à Igreja.
- Gerberga: irmã de Otto; casada com Giselberto da Lotaríngia em 936.
- Edviges: irmã de Otto; posteriormente casada com Hugo, o Grande (a situação
  exata em julho de 936 ainda será conferida antes de entrar nos dados).
- Edite: esposa de Otto.
- Liudolfo e Liutgarda: filhos de Otto e Edite.

Datas, grafias, títulos e fontes estão em
`dados/historico/personagens_936.json`, que também inclui Guilherme (filho
ilegítimo de Otto, n. 929) e os duques de 936. Em julho de 936 Edviges e
Henrique ainda são solteiros (casamentos em 937 e 936/37).

## Regras de simulação confirmadas

- O mapa será 2D, estratégico e relativamente estático.
- O tempo será discreto, mesmo que a apresentação futura pareça contínua.
- Personagens não possuem conhecimento global.
- Informações podem ser observadas, transmitidas, ocultadas ou distorcidas.
- Rancor e lealdade devem apontar para acontecimentos e memórias específicas;
  números agregados podem existir apenas como consequência dessas memórias.
- O motor do jogo valida recursos, alcance, conhecimento e legalidade de toda
  ação. Um eventual LLM nunca altera diretamente o estado do mundo.
- A primeira versão deve funcionar sem serviços pagos e sem IA generativa.
- A escolha régia busca consenso, mas o jogo usa uma simplificação declarada:
  três dos cinco grandes podem fazer alguém rei. Quem não aderiu permanece como
  pendência de reconhecimento para sistemas futuros. Não chamar isso de voto
  ou maioria na interface.
- Cada grande começa apoiando a si mesmo. Confiança, rancor e legitimidade
  percebida determinam se transfere o apoio a outro pretendente.
- A campanha inicial termina quando alguém reúne três apoios ou após 24 meses
  sem consenso.
- Siegfried permanece na base histórica, mas não é um sexto apoio no primeiro
  cenário. Otto representar o poder saxão é uma simplificação declarada; incluir
  Siegfried agora quebraria o recorte testado de cinco poderes.
- **Poder e legitimidade são separados** (Vitor, 2026-10-03):
  - poder não é um atributo que se treina: é calculado de coisas concretas
    (regiões controladas, soldados, ouro);
  - o poder serve à força: quanto ouro se tira de uma região, quantos
    soldados se convocam, o peso de uma ameaça;
  - convencer depende da legitimidade e das memórias que o alvo tem de quem
    pede, não do poder;
  - cada personagem reage ao poder que acredita que o outro tem, não ao
    verdadeiro.
  Em aberto: o freio contra a bola de neve (poder → ouro e soldados → mais
  poder) e o que substitui a ação "fortalecer".

## Estratégia de custo

- Codex e Claude são ferramentas de desenvolvimento, não dependências do jogo.
- Preferir software gratuito e formatos abertos.
- Implementar primeiro IA determinística por utilidade e regras.
- Avaliar um modelo local gratuito somente depois de existir um protótipo
  jogável e apenas se ele melhorar decisões ou diálogos de maneira mensurável.
- Manter documentação enxuta para não repetir contexto a cada sessão.

## Tecnologia

- O primeiro protótipo usa HTML, CSS e JavaScript sem bibliotecas externas.
- A simulação não depende da interface e é testada pelo executor nativo do
  Node.js.
- Motivo: o ambiente atual já possui Node, não possui Godot, e um mapa político
  estático não justifica instalar um motor antes de validar o núcleo do jogo.
- A escolha vale para o protótipo, não impede empacotamento ou migração futura.

## Divisão de trabalho

### Vitor — direção do projeto

- Define a visão do jogo, prioridades, escopo e experiência desejada.
- Decide questões criativas ou de design que admitam mais de uma solução boa.
- Aprova mudanças de premissa, tecnologia, marco ou divisão de trabalho.
- Dá a palavra final quando fidelidade histórica e jogabilidade entram em
  conflito.

### Codex — produção técnica e design de sistemas

- Converte a visão e o plano em regras de jogo implementáveis.
- Mantém arquitetura, código, interface, testes, saves e ferramentas.
- Integra ao jogo os dados e textos entregues pelo Claude.
- Faz balanceamento, simulações em lote, diagnóstico de erros e revisão visual.
- Pode ajustar redação apenas para encaixe técnico, clareza ou consistência,
  sem inventar fatos históricos; mudanças de sentido voltam ao Claude.
- Não apresenta como histórico um elemento que o Claude marcou como incerto,
  liberdade de design ou anacronismo.
- Não delega ao Claude programação, depuração, arquitetura ou balanceamento.

### Claude — design político-narrativo, pesquisa e crítica

- Transforma objetivos abstratos como ambição, lealdade, medo, dívida e honra em
  situações políticas compreensíveis, escolhas difíceis e consequências.
- Desenha propostas de eventos, dilemas, contrapartidas, compromissos, rupturas
  e reações de personagens para os sistemas previstos no marco atual.
- Especifica conteúdo de jogo em formato estruturado: condições de entrada,
  opções, efeitos pretendidos, informação disponível e justificativa do agente.
- Faz crítica de design antes da implementação: procura escolhas óbvias, ações
  sem custo, estratégias dominantes, personagens sem função e regras que não
  produzam histórias interessantes.
- Faz testes de mesa e revisa transcrições de campanhas ou resultados de
  simulações, apontando padrões artificiais e propondo hipóteses de correção.
- Revisa se as decisões dos agentes são coerentes com suas memórias,
  percepções, interesses e conhecimento limitado.
- Planeja a experiência narrativa da campanha: ritmo, escalada, variedade,
  clareza das consequências e cadeia de acontecimentos do relatório final.
- Escreve e revisa textos de interface, acontecimentos, explicações de decisões
  e encerramentos, mantendo voz e terminologia consistentes.
- Pesquisa os fatos necessários aos sistemas em produção e mantém fontes, graus
  de certeza e distinção entre fato, inferência e liberdade de design.
- Revisa nomes, datas, parentescos, títulos, cerimônias e vocabulário de época.
- Pode propor regras e parâmetros, mas os entrega como hipóteses justificadas;
  Codex verifica viabilidade, implementa e mede o balanceamento.
- Não altera código executável, não declara balanceamento sem evidência de jogo
  e não amplia pesquisa ou conteúdo para partes ainda fora do plano.

### Passagem de trabalho

1. Codex identifica a menor dúvida histórica que bloqueia uma regra e a registra
   em `RECADOS.md`, com contexto, formato esperado e decisão necessária.
2. Claude responde com pesquisa, crítica ou especificação de conteúdo no arquivo
   apropriado; quando houver história, cita fontes e marca claramente certeza,
   inferência e liberdade de design.
3. Codex valida a entrega contra o sistema, resolve limites técnicos, implementa,
   testa, mede e registra qualquer simplificação adotada.
4. Claude revisa o resultado integrado como experiência política, narrativa e
   histórica; Codex corrige os efeitos técnicos e mede as hipóteses de ajuste.
5. Divergências que mudem escopo, diversão ou premissa são apresentadas a Vitor
   como opções curtas. Nenhum dos dois presume a decisão.

`RECADOS.md` é usado somente para entregas e pendências entre os agentes.
Decisões permanentes são incorporadas neste arquivo, e tarefas ficam em
`plano_de_acao.md`.

## Decisões em aberto

- Tamanho e divisão do mapa inicial.
- Casas e personagens jogáveis além dos Liudolfingas.
- Condições de vitória e duração média da campanha.
- Escala dos recursos. Proposta do Claude, com fontes em
  `dados/historico/recursos_936.json`: soldados em faixas (centenas a poucos
  milhares por ducado), não em números exatos, porque as fontes de 955 e 981
  só dão escala. Um freio possível para a bola de neve: convocar a Saxônia
  contra outro duque enfraquece a fronteira eslava.
- Idioma final da interface.
- Convenção de nomes (decisão do Vitor). Uso provisório nos dados: forma
  portuguesa quando há tradição em português (Henrique, Matilde, Edite,
  Arnulfo, Hermano, Giselberto, Liudolfo); forma original quando não há
  (Thankmar, Siegfried, Gero). Casos ambíguos:
  - Otto (forma original, a usada hoje) ou Otão (forma tradicional em
    português);
  - Eberhardo (a usada hoje) ou Eberardo.
  Qualquer escolha só muda o campo `nome`; `nome_historico` fica igual.

## Estado atual

O primeiro ciclo jogável existe: o jogador escolhe um dos cinco governantes e,
a cada mês, pode conversar, propor amizade, pedir apoio, contestar um rival ou
aguardar; depois os outros agentes resolvem suas ações. Três apoios fazem um
pretendente rei. O mapa continua esquemático e ainda falta inspeção visual num
ambiente com navegador.
