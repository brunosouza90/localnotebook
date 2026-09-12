<div align="center">
  <img src="assets/local-notebook-logo.png" alt="Local Notebook logo" width="180" />

  # Local Notebook

  ### Your local AI study workspace for certification-driven learning.

  **Local RAG · AI Tutor · Quizzes · Mock Exams · Node.js · TypeScript**

  <p>
    <a href="#-highlights">Highlights</a> ·
    <a href="#-architecture">Architecture</a> ·
    <a href="#-quick-start">Quick Start</a> ·
    <a href="#-api">API</a> ·
    <a href="#-roadmap">Roadmap</a> ·
    <a href="#-authorship--brand">Authorship</a>
  </p>

  <p>
    <a href="https://nodejs.org/">Node.js 20+</a>
    ·
    <a href="https://www.typescriptlang.org/">TypeScript</a>
    ·
    <a href="https://fastify.dev/">Fastify</a>
    ·
    <a href="https://ai.google.dev/">Gemini</a>
  </p>
</div>

---

## 🧠 What is Local Notebook?

**Local Notebook** is an AI-powered study agent designed for people preparing for **AI certifications and technical exams**.

Instead of treating an LLM as a generic chatbot, Local Notebook builds a **local knowledge base from your own sources**, retrieves relevant context, and uses that context to act as a tutor.

It can:

- 📚 ingest study material and build a local RAG knowledge base;
- 🤖 answer questions as a context-grounded AI tutor;
- 📝 generate conversational summaries;
- 🧩 create quizzes by topic;
- 🎯 simulate mock exams;
- 🔎 preserve source metadata and retrieved chunks;
- 🛡️ fall back to deterministic behavior when no Gemini API key is configured.

> **Core principle:** the tutor should prefer retrieved evidence over unsupported model knowledge and explicitly state when evidence is insufficient.

---

## ✨ Highlights

| Capability | Local Notebook |
|---|---|
| **Knowledge** | Local source ingestion + lexical retrieval |
| **RAG** | Local-first retrieval without an external vector database |
| **AI Tutor** | Gemini integration through `@google/generative-ai` |
| **Assessment** | Quizzes and mock exams |
| **Runtime** | Node.js + TypeScript + Fastify |
| **Storage** | SQLite via `better-sqlite3` |
| **Resilience** | Deterministic fallback without `GEMINI_API_KEY` |
| **Developer workflow** | Custom Agent support for VS Code |

---

## 🏗️ Architecture

The project follows a **research-agent** style organization adapted to a Node.js/TypeScript runtime:

```text
local-notebook/
│
├── manifest.yaml
├── instructions/       # identity, behavior and policies
├── skills/             # research and analysis skills + examples
├── tools/              # search, database and calculator tools
├── memory/             # short_term and long_term memory
├── prompts/templates/  # research and synthesis prompts
├── runtime/            # orchestrator, context and policy
├── evaluation/         # test cases, benchmarks and criteria
├── observability/      # tracing configuration
├── src/                # API, RAG and Gemini adapters
└── .github/agents/     # VS Code Custom Agent integration
```

The original `tool.py` concept is implemented as **`tool.ts`** because the runtime is Node.js/TypeScript. The main server facade is `runtime/orchestrator.ts`.

---

## 🚀 Quick Start

### Requirements

- **Node.js 20+**
- A Gemini API key for AI-powered responses

### 1. Configure the environment

```bash
cp .env.example .env
```

Then set:

```env
GEMINI_API_KEY=your_api_key_here
```

> Never commit API keys to Git, issues, logs or documentation.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3333
```

### 4. Build and run production mode

```bash
npm run build
npm start
```

### 5. Ingest a local source

```bash
npm run ingest -- ./fonte.txt "Nome da fonte"
```

---

## 🔌 API

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/sources` | Add a source by content or URL |
| `GET` | `/api/sources` | List ingested sources |
| `POST` | `/api/ask` | Ask the tutor a question |
| `POST` | `/api/quiz` | Generate a quiz |
| `POST` | `/api/mock-exam` | Generate a mock exam |
| `GET` | `/health` | Health check |

### Example — ask the tutor

```json
{
  "question": "Explain the difference between RAG and fine-tuning."
}
```

### Example — generate a quiz

```json
{
  "topic": "Generative AI",
  "count": 5
}
```

### Example — generate a mock exam

```json
{
  "topic": "AI Architecture",
  "count": 10
}
```

---

## 🎯 Quality principles

Local Notebook is designed around a few non-negotiable principles:

1. **Evidence first** — answers should be grounded in retrieved context.
2. **Traceability** — retrieved chunks should be identifiable and attributable to their sources.
3. **Honest uncertainty** — the tutor should state when evidence is missing.
4. **Local-first architecture** — the knowledge layer does not require an external vector database.
5. **Secret hygiene** — credentials must never be committed.

---

## 🧪 Development & Community

The project is structured for public development:

- CI runs tests and the Node.js 20 build.
- Dependabot checks dependency updates weekly.
- `SECURITY.md` defines the vulnerability-reporting process.
- `CONTRIBUTING.md` defines the contribution workflow.
- `PUBLICATION_CHECKLIST.md` provides the pre-publication checklist.
- `LICENSE` defines the project's usage terms.

---

## 🗺️ Roadmap

The current architecture intentionally keeps the retrieval layer simple. The recommended production evolution is:

```text
Current
  ↓
Local lexical retrieval
  ↓
Gemini-powered tutoring
  ↓
Quizzes + mock exams

Next
  ↓
Gemini embeddings
  ↓
Vector index
  ↓
Authentication
  ↓
Observability
  ↓
Automated evaluation
  ↓
Certification-aware filters
  ↓
Dedicated web frontend
```

---

## 👤 Authorship & Brand

**Local Notebook** is an original project authored by **Bruno Rodrigues Lopes**.

Author profile: [**Bruno Rodrigues Lopes | LinkedIn**](https://www.linkedin.com/in/brunolopes2/)

For provenance and authorship, the project should preserve its Git history, release tags, signed commits where practical, and dated public releases. For stronger legal protection in Brazil, consider separately protecting the **brand** and the **software** through the appropriate INPI mechanisms.

> **Important:** GitHub publication demonstrates public provenance, but it is not the same thing as registering a trademark. The name/logo of the project and the source code are distinct intellectual-property assets.

### Brand protection

For the **Local Notebook** name and logo, the appropriate route is a trademark search and, if available, a trademark application with **INPI** in the classes that correspond to the business you intend to operate. INPI states that trademark registration grants exclusive use of the registered mark in Brazil within its economic activity scope. [INPI — Marcas](https://www.gov.br/inpi/pt-br/uso-estrategico-da-pi/inpi-para-empreender-e-inovar/2-marcas)

### Software authorship

For the software itself, INPI provides **computer-program registration**, which can strengthen evidence of authorship or ownership in legal disputes. INPI describes the registration as a way to provide greater legal security to the software holder. [INPI — Programa de Computador](https://www.gov.br/inpi/pt-br/uso-estrategico-da-pi/inpi-para-empreender-e-inovar/3-programa-de-computador)

This README is therefore intentionally explicit about project authorship, while avoiding the claim that a trademark is already registered.

---

## 📜 License

See [LICENSE](LICENSE) for the exact terms of use.

> **Commercial note:** if this project evolves into a monetized product, review the repository license and dependency licenses before offering hosted, commercial or enterprise versions.

---

<div align="center">

### Built for people who want to learn AI by working with AI.

**Local Notebook** · AI Study Agent · Local RAG · Certification Learning

Made with curiosity by [Bruno Rodrigues Lopes](https://www.linkedin.com/in/brunolopes2/)

</div>
