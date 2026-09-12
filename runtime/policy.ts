import type { SearchResult } from '../src/types.js';

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

// Impede respostas apresentadas como fundamentadas quando o RAG nao encontrou evidencia.
export function requireEvidence(results: SearchResult[]): PolicyDecision {
  return results.length > 0
    ? { allowed: true }
    : { allowed: false, reason: 'Nao ha evidencia suficiente nas fontes cadastradas.' };
}

// Mantem limites previsiveis para geracao de quizzes e simulados.
export function clampQuestionCount(count: number, maximum = 50): number {
  return Math.min(Math.max(Math.floor(count), 1), maximum);
}
