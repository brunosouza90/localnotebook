import { searchChunks } from '../../src/db.js';

// Ferramenta de busca usada pelo runtime para localizar evidencias no RAG.
export function searchTool(query: string, limit = 6) {
  return searchChunks(query, limit);
}
