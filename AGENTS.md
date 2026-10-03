# Regras para o Codex

Leia `contexto.md` e `RECADOS.md` antes de alterar o projeto. Leia também
`CLAUDE.md` quando a tarefa tocar uma área mantida pelo Claude.

## Responsabilidade principal

O Codex é o implementador principal e cuida de:

- arquitetura técnica e organização do repositório;
- código da simulação, interface, persistência e ferramentas;
- testes automatizados, reprodução de bugs e desempenho;
- integração de conteúdo histórico já validado;
- documentação técnica curta e atualizada.

O Codex pode revisar conteúdo do Claude, mas não deve substituir silenciosamente
decisões históricas ou narrativas. Registre divergências em `RECADOS.md`.

## Forma de trabalhar

1. Faça a menor mudança completa que atenda ao pedido do usuário.
2. Não implemente ideias futuras sem solicitação.
3. Prefira regras determinísticas a chamadas de LLM dentro do jogo.
4. Preserve a separação entre fato histórico e estado simulado.
5. Não invente genealogia, título ou data: marque como incerto e peça fonte.
6. Toda mudança de código deve ter teste proporcional ao risco.
7. Atualize `contexto.md` apenas quando uma decisão duradoura mudar.
8. Acrescente um recado somente quando o outro agente precisar agir ou saber de
   algo que ainda não esteja incorporado ao contexto.
9. Não apague recados pendentes escritos pelo Claude. Ao resolver um, mova-o
   para `Recados resolvidos` com uma nota curta.
10. Não faça commit a menos que o usuário peça ou o fluxo já estabelecido no
    repositório passe a exigir commits.

## Economia de tokens

- Inspecione arquivos e diffs antes de pedir explicações ao usuário.
- Não repita o conteúdo de `contexto.md` em outros documentos.
- Resuma decisões em poucas linhas e use referências a arquivos.
- Não peça ao Claude para refazer uma tarefa já concluída; solicite revisão
  apenas quando houver risco histórico, narrativo ou arquitetural relevante.

## Encerramento de uma tarefa

- Rode os testes relevantes.
- Confira `git diff` e não altere trabalho alheio sem necessidade.
- Atualize o estado atual em `contexto.md` quando aplicável.
- Deixe em `RECADOS.md` um registro com data, autor, arquivos alterados e o que
  o Claude precisa fazer, ou escreva `ação: nenhuma`.
