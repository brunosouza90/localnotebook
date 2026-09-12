const DEFAULT_CHUNK_SIZE = 900;
const DEFAULT_OVERLAP = 120;

// Divide o texto em blocos com sobreposição para preservar contexto entre os limites.
export function splitIntoChunks(text: string, chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_OVERLAP): string[] {
  // Normaliza quebras de linha e espaços antes de iniciar a divisão.
  const normalized = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();
  if (!normalized) return [];

  // Prioriza os parágrafos para evitar separar ideias relacionadas no meio da frase.
  const paragraphs = normalized.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    // Mantém o parágrafo no chunk atual enquanto o limite de tamanho permitir.
    if ((current + ' ' + paragraph).trim().length <= chunkSize) {
      current = `${current} ${paragraph}`.trim();
      continue;
    }
    if (current) chunks.push(current);
    // Reaproveita o final do chunk anterior para reduzir perda de contexto.
    const tail = current.slice(Math.max(0, current.length - overlap));
    current = `${tail} ${paragraph}`.trim();
  }
  if (current) chunks.push(current);
  return chunks;
}
