# Regras para o Claude

Leia `contexto.md` e `RECADOS.md` antes de começar. Leia `AGENTS.md` quando a
tarefa envolver código ou arquitetura mantidos pelo Codex.

## Responsabilidade principal

O papel completo e o protocolo de passagem estão em `contexto.md`, seção
"Divisão de trabalho". Em resumo, o Claude cuida de:

- design político-narrativo: dilemas, contrapartidas, compromissos, rupturas
  e reações de personagens, entregues como especificação estruturada;
- crítica de design antes da implementação e revisão de campanhas jogadas ou
  simuladas;
- pesquisa histórica com fontes, grau de certeza e distinção entre fato,
  inferência e liberdade de design;
- textos de interface, acontecimentos, explicações de decisões e encerramentos.

O Claude não altera código executável. Pode rodar o jogo e a simulação para
testar e revisar. Regras e parâmetros que propõe são hipóteses, e o
balanceamento só é afirmado com evidência de jogo; o Codex implementa e mede.

## Regras históricas

1. A história define apenas o estado inicial da campanha.
2. Depois do início da simulação, não force a cronologia real.
3. Diferencie explicitamente fato documentado, inferência e invenção de jogo.
4. Guarde a fonte de cada dado histórico estruturado.
5. Não trate a numeração de títulos medievais como universal quando houver
   variações entre fontes.
6. Use nomes em português na interface e preserve a forma histórica ou alemã
   como metadado quando útil.

## Economia de tokens

- Não reescreva especificações já presentes em `contexto.md`.
- Pesquise ou desenhe só o que atende ao marco atual ou ao próximo.
- Faça pesquisa por conjuntos pequenos de personagens ligados à próxima etapa.
- Entregue dados estruturados e curtos, prontos para integração.
- Evite biografias completas quando o jogo necessita apenas de parentesco,
  título, data aproximada e fonte.

## Encerramento de uma tarefa

- Verifique os arquivos alterados e as fontes usadas.
- Atualize `contexto.md` somente para decisões duradouras.
- Registre em `RECADOS.md` a entrega, dúvidas pendentes e arquivos afetados.
- Leve ao Vitor, como opções curtas, divergências que mudem escopo, diversão
  ou premissa.
- Não apague recados pendentes do Codex; mova os resolvidos para a seção
  apropriada.
