import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { config } from './config.js';
import type { Chunk, SearchResult, Source } from './types.js';

// Garante que a pasta do banco exista antes de abrir o arquivo SQLite.
mkdirSync(dirname(config.databasePath), { recursive: true });
const db = new Database(config.databasePath);
// WAL permite leituras concorrentes sem bloquear todas as operações de escrita.
db.pragma('journal_mode = WAL');
// Cria o esquema mínimo do RAG na primeira execução da aplicação.
db.exec(`
  CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, type TEXT NOT NULL, uri TEXT,
    content TEXT NOT NULL, created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS chunks (
    id TEXT PRIMARY KEY, source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    content TEXT NOT NULL, position INTEGER NOT NULL, token_count INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_chunks_source ON chunks(source_id);
`);

export function saveSource(source: Source, content: string, chunks: Chunk[]): void {
  // Salva fonte e chunks como uma única operação: se algo falhar, nada fica parcial.
  const transaction = db.transaction(() => {
    db.prepare('INSERT INTO sources (id, title, type, uri, content, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(source.id, source.title, source.type, source.uri ?? null, content, source.createdAt);
    const statement = db.prepare('INSERT INTO chunks (id, source_id, content, position, token_count) VALUES (?, ?, ?, ?, ?)');
    for (const chunk of chunks) statement.run(chunk.id, chunk.sourceId, chunk.content, chunk.position, chunk.tokenCount);
  });
  transaction();
}

export function listSources(): Source[] {
  // Retorna o catálogo sem carregar o conteúdo completo de cada fonte.
  return db.prepare('SELECT id, title, type, uri, created_at AS createdAt FROM sources ORDER BY created_at DESC').all() as Source[];
}

export function searchChunks(query: string, limit = 6): SearchResult[] {
  // Usa termos relevantes da pergunta para realizar uma busca lexical local simples.
  const terms = query.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [];
  const rows = db.prepare(`SELECT c.id, c.source_id AS sourceId, c.content, c.position, c.token_count AS tokenCount,
    s.title AS sourceTitle FROM chunks c JOIN sources s ON s.id = c.source_id`).all() as Omit<SearchResult, 'score'>[];
  return rows.map((row) => {
    const haystack = row.content.toLowerCase();
    // Conta ocorrências dos termos e protege cada termo antes de criar a expressão regular.
    const hits = terms.reduce((total, term) => total + (haystack.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))?.length ?? 0), 0);
    // Uma correspondência da frase inteira recebe um bônus para melhorar a ordenação.
    const phraseBonus = query.trim() && haystack.includes(query.toLowerCase()) ? 3 : 0;
    return { ...row, score: hits + phraseBonus };
  // Remove chunks sem evidência, ordena pelos mais relevantes e limita o contexto enviado ao tutor.
  }).filter((row) => row.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
}
