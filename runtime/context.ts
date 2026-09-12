import { searchChunks } from '../src/db.js';
import type { SearchResult } from '../src/types.js';

export interface RetrievedContext {
  query: string;
  results: SearchResult[];
  formatted: string;
}

// Recupera evidencias e as formata de maneira consistente para os prompts.
export function retrieveContext(query: string, limit = 6): RetrievedContext {
  const results = searchChunks(query, limit);
  const formatted = results.map((item, index) =>
    `[${index + 1}] ${item.sourceTitle} | chunk ${item.id}\n${item.content}`
  ).join('\n\n');
  return { query, results, formatted };
}
