import { readFile } from 'node:fs/promises';
import { ingestSource } from './ingestion.js';

// Lê o comando, o caminho do arquivo e o título fornecidos pelo terminal.
const [, , command, filePath, ...titleParts] = process.argv;
if (command !== 'ingest' || !filePath) {
  console.log('Uso: npm run ingest -- caminho/da/fonte.txt Titulo da fonte');
  process.exit(1);
}
// Carrega a fonte local e envia o conteúdo pelo mesmo fluxo usado pela API.
const content = await readFile(filePath, 'utf8');
const result = await ingestSource({ title: titleParts.join(' ') || filePath, content, type: 'file' });
console.log(`Fonte ingerida: ${result.source.title} (${result.chunksCreated} chunks)`);
