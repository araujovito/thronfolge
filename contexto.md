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

- Codex: implementação, arquitetura, testes, ferramentas e integração.
- Claude: pesquisa histórica, genealogia, escrita e revisão narrativa.
- Ambos podem revisar o outro quando solicitado; `RECADOS.md` contém os
  handoffs e conflitos ainda não incorporados aqui.

## Decisões em aberto

- Tamanho e divisão do mapa inicial.
- Casas e personagens jogáveis além dos Liudolfingas.
- Condições de vitória e duração média da campanha.
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
a cada mês, pode conversar, oferecer um acordo, difamar ou aguardar; depois os
outros agentes resolvem suas ações. O mapa continua esquemático e ainda falta
inspeção visual num ambiente com navegador.
