import { listSources } from '../../src/db.js';

// Ferramenta de catalogo que consulta apenas os metadados das fontes.
export function databaseTool() {
  return listSources();
}
