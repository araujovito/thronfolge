# Plano de ação — Thronfolge

Este é o roteiro único do projeto. A prioridade é chegar a uma campanha curta,
com início histórico e desfecho emergente, antes de ampliar mapa, genealogia ou
apresentação.

## Definição da primeira versão jogável

Hipóteses provisórias para impedir que o desenvolvimento fique parado:

- o jogador controla um pretendente; os demais são agentes determinísticos;
- a campanha começa em 2 de julho de 936 e dura no máximo 24 turnos mensais;
- o objetivo é obter o apoio de três dos cinco grandes poderes políticos;
- a vitória precisa resultar de decisões, recursos, conhecimento e relações;
- não haverá combate tático, mapa geográfico preciso, LLM ou árvore dinástica
  completa nessa versão.

Essas hipóteses podem mudar, mas uma mudança deve substituir uma regra concreta,
não apenas acrescentar sistemas.

## Regras de qualidade

- História documentada inicializa o mundo; não força o futuro.
- Fato, percepção e memória são dados separados.
- Toda decisão de agente deve poder ser explicada pela interface.
- Poder vem de territórios, ouro e soldados; legitimidade não é poder.
- Nenhuma ação altera o estado sem validar custo, alcance e conhecimento.
- Sistemas novos precisam de teste e de uma função visível na campanha.
- Codex implementa, testa e mede; Claude projeta conteúdo político-narrativo,
  pesquisa e critica a experiência resultante.

## Responsabilidade por entrega

- Uma tarefa de **Codex** termina com código integrado, testes proporcionais ao
  risco e efeito verificável na campanha.
- Uma tarefa de **Claude** termina com uma pesquisa, crítica ou especificação
  acionável no arquivo adequado. Conteúdo histórico inclui fontes e indicação
  explícita do que é fato, inferência ou liberdade de design; conteúdo de jogo
  inclui condições, opções, efeitos pretendidos e informação disponível.
- Pesquisa só começa quando atende uma necessidade do marco atual ou do próximo.
- Claude não altera código executável nem declara balanceamento sem evidência;
  Codex não inventa conteúdo histórico e mede as hipóteses de design recebidas.
- Mudança de escopo, premissa ou prioridade depende de decisão de Vitor.
- O protocolo completo de passagem e os limites de cada função estão em
  `contexto.md`.

## Marco 0 — Consolidar o protótipo atual

**Codex**

- [x] Criar simulação determinística com acontecimentos e memória individual.
- [x] Remover acesso dos agentes à legitimidade verdadeira de terceiros.
- [x] Criar cenário inicial a partir dos dados históricos revisados.
- [x] Criar mapa esquemático, passagem mensal e salvamento local.
- [x] Corrigir a apresentação do dia inicial e dos meses seguintes.
- [x] Impedir que tipos internos de evento apareçam na interface.
- [ ] Fazer uma inspeção visual real no navegador.
- [ ] Criar um commit-base depois da revisão visual.

**Claude**

- [x] Revisar família, governantes, títulos e fontes de julho de 936.
- [x] Revisar o texto da morte de Henrique I e o aviso do mapa esquemático.

**Concluído quando:** o protótipo abre sem erros, avança doze meses, salva,
carrega e não apresenta texto técnico ou afirmação histórica indevida.

## Marco 1 — Transformar o protótipo em jogo

Hoje o usuário apenas observa. Este marco cria escolhas e consequências.

**Codex**

- [x] Criar tela de escolha do personagem inicial.
- [x] Separar turno do jogador e resolução dos agentes.
- [x] Implementar ações manuais: conversar, oferecer acordo e difamar.
- [x] Mostrar alvo e condição antes da confirmação; custos entram quando
  existirem recursos.
- [ ] Permitir que o alvo aceite, recuse ou proponha contrapartida.
- [x] Registrar cada resultado como acontecimento e memória.
- [x] Explicar relações pelas memórias conhecidas; decisões de agentes ainda
  precisam de justificativa individual.
- [x] Impedir ações inválidas; restrições por informação entram com espionagem.

**Claude**

- [x] Revisar o significado político de eleição, aclamação e coroação em 936.
- [x] Escrever textos curtos para proposta, aceitação, recusa e difamação.
- [x] Separar formulação historicamente plausível de liberdade assumida pelo
  design.

**Concluído quando:** o jogador toma pelo menos uma decisão significativa por
mês e consegue alterar deliberadamente uma relação.

## Marco 2 — Sucessão e condição de vitória

**Codex**

- [x] Exibir reivindicações e legitimidade explicadas por argumentos históricos
  concretos, sem obrigar o resultado real.
- [x] Criar apoio político direcionado: cada grande apoia alguém ou ninguém.
- [ ] Implementar promessa, dívida e quebra de compromisso.
- [x] Fazer os grandes escolherem o rei quando houver três apoios, marcando a
  regra como simplificação e não como contagem histórica de votos.
- [x] Encerrar a campanha por escolha régia ou falta de consenso em 24 meses.
- [ ] Gerar relatório final com a cadeia de acontecimentos decisivos.
- [ ] Simular centenas de campanhas para localizar vitórias automáticas,
  empates permanentes e estratégias dominantes.

**Claude**

- [x] Revisar quem participa da escolha real e quais simplificações são
  aceitáveis para cinco poderes.
- [x] Revisar nomes de títulos, reivindicações e cerimônias.
- [x] Preparar um aviso histórico curto sobre linhas do tempo alternativas.
- [ ] Definir quais decisões e viradas tornam uma campanha digna do relatório
  final, com modelos curtos para vitória e falta de consenso.
- [ ] Revisar campanhas simuladas e apontar decisões incoerentes, pretendentes
  passivos, resultados sem causa legível e estratégias aparentemente óbvias.

**Concluído quando:** campanhas completas produzem vencedores diferentes por
razões recuperáveis no histórico, sem evento roteirizado escolher o rei.

## Marco 3 — Recursos, ameaça e informação imperfeita

**Codex**

- [ ] Fazer regiões gerarem ouro e capacidade de mobilização.
- [ ] Calcular soldados disponíveis, convocados e seu custo de manutenção.
- [ ] Implementar ameaça usando poder percebido, não poder verdadeiro.
- [ ] Criar espionagem para atualizar estimativas sobre rivais.
- [ ] Fazer notícias se propagarem entre personagens com origem registrada.
- [ ] Adicionar rumores incompletos ou errados somente depois de a transmissão
  de fatos verdadeiros estar testada.
- [ ] Criar freios à bola de neve: manutenção, resistência local e coalizões.

**Claude**

- [x] Revisar apenas ordens de grandeza necessárias para diferenciar regiões;
  não inventar censos precisos inexistentes.
- [x] Revisar vocabulário de tributo, hoste, mensageiros e juramentos.
- [ ] Projetar dilemas que obriguem o jogador a trocar riqueza, mobilização,
  confiança e segurança, sem transformar recursos em bônus abstratos.
- [ ] Especificar exemplos de notícia, atraso, rumor e descoberta com origem,
  alcance, conteúdo percebido e possível consequência política.
- [ ] Testar em mesa se personagens com informações diferentes chegam a
  decisões diferentes por razões compreensíveis.

**Concluído quando:** possuir mais território ajuda, mas não garante a coroa, e
personagens podem tomar decisões diferentes por conhecerem versões diferentes
da mesma situação.

## Marco 4 — Diplomacia e conflito

**Codex**

- [ ] Adicionar alianças, garantias, reféns políticos e ultimatos.
- [ ] Implementar mobilização e guerra abstrata por regiões, sem batalha tática.
- [ ] Fazer agressão gerar custos, testemunhas e novas coalizões.
- [ ] Permitir rendição, negociação e mudança de lado.
- [ ] Verificar que guerra é uma opção política, não a solução universal.

**Claude**

- [ ] Revisar práticas plausíveis de negociação e conflito no século X.
- [ ] Escrever mensagens curtas para ultimatos, rendições e acordos.
- [ ] Projetar contrapartidas, compromissos, reféns, garantias e mudanças de lado
  como dilemas estruturados, indicando condições e efeitos pretendidos.
- [ ] Revisar se guerra permanece continuação da política e se há saídas
  narrativamente satisfatórias além de vencer pela força.

**Concluído quando:** uma guerra muda a disputa política sem substituir todo o
jogo por comparação de números militares.

## Marco 5 — Família e continuidade

Só começar se a campanha política dos marcos anteriores já for divertida.

- [ ] Integrar parentes, casamentos e filhos relevantes do arquivo histórico.
- [ ] Criar casamento como acordo político, não como catálogo de personagens.
- [ ] Implementar morte, herança e sucessão familiar.
- [ ] Permitir campanhas maiores apenas depois de validar o recorte de 936.
- [ ] Pedir ao Claude novos personagens por necessidade do sistema, em pequenos
  conjuntos com fontes, nunca uma enciclopédia antecipada.
- [ ] Claude desenha dilemas familiares apenas para relações que alterem poder,
  sucessão, confiança ou compromissos da campanha.
- [ ] Claude revisa se parentes agem como agentes políticos, não como bônus ou
  entradas de catálogo genealógico.

## Marco 6 — Apresentação e distribuição

- [ ] Substituir o mapa esquemático por representação historicamente orientada.
- [ ] Melhorar retratos, brasões, tipografia, áudio e acessibilidade.
  Retratos: SVG em camadas, estilo CK, a partir de
  `dados/historico/referencias_visuais_936.json`.
- [ ] Versionar saves e criar migrações.
- [ ] Fazer testes de usabilidade e balanceamento com jogadores.
- [ ] Avaliar empacotamento para desktop somente depois da campanha completa.
- [ ] Avaliar modelo local apenas contra uma versão determinística já medida;
  rejeitá-lo se não melhorar decisões de forma perceptível.
- [ ] Claude revisa ritmo, clareza das causas, variedade dos relatos e força dos
  encerramentos a partir de campanhas completas.

## Fora do escopo atual

- mapa completo da Europa;
- batalhas em tempo real ou unidades caminhando no mapa;
- economia detalhada de cidades;
- multiplayer;
- reprodução obrigatória de eventos posteriores a 2 de julho de 936;
- chamadas pagas de IA durante a partida;
- biografias completas de personagens que ainda não afetam a campanha.

## Próxima ordem de execução

1. Codex corrige as duas pendências de interface e realiza a revisão visual.
2. Claude pesquisa a escolha régia de 936 e entrega apenas as regras necessárias
   ao sistema de apoio.
3. Codex implementa escolha de personagem e as três primeiras ações do jogador.
4. Ambos revisam uma campanha manual de doze turnos antes de criar recursos ou
   guerra.
