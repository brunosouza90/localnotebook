import { randomUUID } from 'node:crypto';
import { splitIntoChunks } from './chunker.js';
import { saveSource } from './db.js';
import type { Source, SourceType } from './types.js';

// Converte uma entrada externa em fonte persistida e chunks pesquisáveis.
export async function ingestSource(input: { title: string; content?: string; url?: string; type?: SourceType }) {
  // Infere o tipo quando a chamada não o informa explicitamente.
  const type = input.type ?? (input.url ? 'url' : 'text');
  // URLs são baixadas antes do processamento; textos já chegam prontos para chunking.
  const content = input.url ? await fetchText(input.url) : input.content?.trim();
  if (!content) throw new Error('A fonte precisa ter content ou url.');
  const source: Source = { id: randomUUID(), title: input.title, type, uri: input.url, createdAt: new Date().toISOString() };
  // Cada chunk recebe identidade própria para permitir citações precisas na resposta.
  const chunks = splitIntoChunks(content).map((chunk, position) => ({
    id: randomUUID(), sourceId: source.id, content: chunk, position, tokenCount: Math.ceil(chunk.length / 4)
  }));
  saveSource(source, content, chunks);
  return { source, chunksCreated: chunks.length };
}

// Busca uma página e remove marcação HTML para deixar apenas texto indexável.
async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: { 'user-agent': 'local notebook/0.1' } });
  if (!response.ok) throw new Error(`Nao foi possivel ler a URL (${response.status}).`);
  const html = await response.text();
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}
