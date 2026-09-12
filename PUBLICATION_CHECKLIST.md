# Checklist de publicacao

## Seguranca

- [ ] Revogar qualquer chave Gemini que tenha sido exposta.
- [ ] Confirmar que `.env`, `data/`, `dist/` e `node_modules/` nao estao rastreados.
- [ ] Conferir `git diff --cached` antes do primeiro push.
- [ ] Remover documentos privados e dados de teste reais.
- [ ] Executar `npm audit` e registrar riscos conhecidos.

## Qualidade

- [ ] Executar `npm install` ou `npm ci`.
- [ ] Executar `npm test`.
- [ ] Executar `npm run build`.
- [ ] Testar `/health`, ingestao, pergunta, quiz e simulado.
- [ ] Confirmar que o fallback funciona sem `GEMINI_API_KEY`.

## GitHub

- [ ] Criar repositorio publico sem inicializar arquivos conflitantes.
- [ ] Adicionar descricao e topicos do projeto.
- [ ] Adicionar LICENSE, CONTRIBUTING.md, SECURITY.md e CODE_OF_CONDUCT.md.
- [ ] Habilitar Dependabot e a workflow de CI.
- [ ] Revisar permissao de Actions e protecao da branch principal.
- [ ] Publicar o primeiro release depois da CI passar.
