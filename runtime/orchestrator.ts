import { answerQuestion, createMockExam, createQuiz } from '../src/tutor.js';
import { ingestSource } from '../src/ingestion.js';
import { retrieveContext } from './context.js';
import { clampQuestionCount, requireEvidence } from './policy.js';
import type { TutorAnswer } from '../src/types.js';

// Fachada principal que coordena ingestao, recuperacao, tutoria e avaliacao.
export const agent = {
  ingest: ingestSource,
  async ask(question: string): Promise<TutorAnswer> {
    const context = retrieveContext(question);
    const decision = requireEvidence(context.results);
    if (!decision.allowed) return { answer: decision.reason!, citations: [], grounded: false };
    return answerQuestion(question);
  },
  quiz(topic: string, count = 5) {
    return createQuiz(topic, clampQuestionCount(count, 20));
  },
  mockExam(topic: string, count = 10) {
    return createMockExam(topic, clampQuestionCount(count));
  }
};
