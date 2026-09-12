# Contribuindo

Obrigado por contribuir com o Certifica AI Tutor.

## Antes de abrir uma proposta

1. Procure uma issue existente.
2. Para mudancas grandes, abra uma issue descrevendo o problema e a solucao.
3. Nunca envie chaves de API, bases SQLite, documentos privados ou dados pessoais.

## Ambiente local

- Node.js 20 ou superior
- npm 9 ou superior

```bash
npm install
npm test
npm run build
```

## Padrao de codigo

- Use TypeScript estrito e mantenha as responsabilidades separadas.
- Comente decisoes relevantes em portugues.
- Preserve a separacao entre `runtime`, `tools`, `src` e configuracoes do agente.
- Valide entradas externas com Zod.
- Nao inclua segredos em codigo, testes, fixtures ou logs.

## Pull requests

Toda PR deve informar:

- problema resolvido;
- comportamento alterado;
- testes executados;
- riscos ou limitacoes conhecidos.

A CI precisa passar antes do merge.
