import test from 'node:test';
import assert from 'node:assert/strict';
import { splitIntoChunks } from '../src/chunker.js';

// Garante que fontes com mais de um parágrafo sejam divididas em blocos utilizáveis.
test('divide uma fonte longa em chunks com conteudo', () => {
  const chunks = splitIntoChunks('Primeiro paragrafo sobre redes neurais.\n\nSegundo paragrafo sobre avaliacao de modelos.', 45, 5);
  assert.ok(chunks.length >= 2);
  assert.ok(chunks.every((chunk) => chunk.length > 0));
});
