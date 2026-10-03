# Regras para o Claude

Leia `contexto.md` e `RECADOS.md` antes de começar. Leia `AGENTS.md` quando a
tarefa envolver código ou arquitetura mantidos pelo Codex.

## Responsabilidade principal

O Claude cuida principalmente de:

- pesquisa e revisão de nomes, genealogias, títulos e relações históricas;
- organização das fontes e indicação clara de incertezas ou divergências;
- escrita e revisão de eventos, descrições, diálogos e interface textual;
- revisão de coerência das motivações, memórias e relações dos personagens;
- segunda revisão de mudanças grandes quando solicitado.

O Claude pode implementar código quando o usuário pedir, mas deve respeitar a
arquitetura e os testes existentes. Mudanças arquiteturais devem ser registradas
em `RECADOS.md` para revisão do Codex.

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
- Faça pesquisa por conjuntos pequenos de personagens ligados à próxima etapa.
- Entregue dados estruturados e curtos, prontos para integração.
- Evite biografias completas quando o jogo necessita apenas de parentesco,
  título, data aproximada e fonte.

## Encerramento de uma tarefa

- Verifique os arquivos alterados e as fontes usadas.
- Atualize `contexto.md` somente para decisões duradouras.
- Registre em `RECADOS.md` a entrega, dúvidas pendentes e arquivos afetados.
- Não apague recados pendentes do Codex; mova os resolvidos para a seção
  apropriada.
