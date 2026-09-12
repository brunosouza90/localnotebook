# Local Notebook

Agente de estudos em Node.js para certificacoes de IA. Ele recebe fontes, cria um RAG local, responde como tutor e gera resumos conversacionais, quizzes e simulados.

## Stack

- Node.js + TypeScript + Fastify
- SQLite local via `better-sqlite3`
- Recuperacao lexical local, sem dependencia de vetor externo
- Gemini via `@google/generative-ai`
- Fallback deterministico quando `GEMINI_API_KEY` nao estiver configurada

## Arquitetura do agente

A organizacao segue o modelo `research-agent` solicitado, adaptado para Node.js:

```text
manifest.yaml
instructions/       identidade, comportamento e politicas
skills/             pesquisa e analise com exemplos
tools/              busca, banco e calculadora em TypeScript
memory/             short_term e long_term
prompts/templates/  pesquisa e sintese
runtime/            orchestrator, context e policy
evaluation/         casos, benchmarks e criterios
observability/      configuracao de tracing
src/                adaptadores atuais de API, RAG e Gemini
```

Os arquivos pedidos como `tool.py` foram implementados como `tool.ts`, pois o runtime deste projeto e Node.js/TypeScript. O servidor usa `runtime/orchestrator.ts` como fachada para as responsabilidades do agente.

## Como executar

1. Use Node.js 20 ou superior.
2. Copie `.env.example` para `.env` e preencha `GEMINI_API_KEY`.
3. Rode `npm install`.
4. Rode `npm run dev`.

A API fica em `http://localhost:3333`.

Para executar a versao compilada:

```bash
npm run build
npm start
```

## Endpoints

- `POST /api/sources` com `{ "title": "...", "content": "..." }` ou `{ "title": "...", "url": "https://..." }`
- `GET /api/sources`
- `POST /api/ask` com `{ "question": "..." }`
- `POST /api/quiz` com `{ "topic": "...", "count": 5 }`
- `POST /api/mock-exam` com `{ "topic": "...", "count": 10 }`
- `GET /health`

Para fontes locais: `npm run ingest -- ./fonte.txt Nome da fonte`.

## Publicacao e seguranca

Este projeto pode ser publicado como repositorio publico. Cada pessoa deve usar sua propria `GEMINI_API_KEY`; a chave nunca deve ser colocada no codigo, em issues, em logs ou no repositorio.

Antes de publicar, siga [PUBLICATION_CHECKLIST.md](PUBLICATION_CHECKLIST.md). Consulte [SECURITY.md](SECURITY.md) para reportar vulnerabilidades, [CONTRIBUTING.md](CONTRIBUTING.md) para contribuir e [LICENSE](LICENSE) para os termos de uso.

O arquivo `.github/agents/local-notebook.agent.md` permite usar o tutor como Custom Agent no VS Code, enquanto a API Node.js permite executar o agente como aplicacao independente.

## Desenvolvimento comunitario

Pull requests passam pela CI, que executa testes e build com Node.js 20. Dependabot verifica atualizacoes de dependencias semanalmente.

## Premissas de qualidade

O tutor deve responder apenas com contexto recuperado, citar os chunks usados e declarar quando nao houver evidencias. Fontes sao preservadas com titulo, tipo, URI, data e ordem dos chunks. A chave Gemini nunca deve ser commitada.

## Evolucao recomendada

Para producao, substitua a busca lexical por embeddings Gemini e um indice vetorial, adicione autenticacao, observabilidade, avaliacao automatica de respostas, filtros por certificacao e um frontend separado.
