import { searchChunks } from './db.js';
import { getLlm, hasGemini } from './llm.js';
import type { QuizQuestion, TutorAnswer } from './types.js';

// Formata os chunks recuperados para compor o contexto enviado ao modelo.
function contextBlock(query: string, limit = 6) {
  return searchChunks(query, limit).map((item, index) => `[${index + 1}] ${item.sourceTitle} (${item.id})\n${item.content}`).join('\n\n');
}

// Responde perguntas usando somente evidências recuperadas da base do estudante.
export async function answerQuestion(question: string): Promise<TutorAnswer> {
  const results = searchChunks(question, 6);
  // Evita inventar uma resposta quando o RAG não encontrou evidências suficientes.
  if (!results.length) return { answer: 'Ainda nao encontrei essa informacao nas fontes cadastradas. Adicione uma fonte relevante ou reformule a pergunta.', citations: [], grounded: false };
  const context = results.map((item, index) => `[${index + 1}] ${item.sourceTitle} | chunk ${item.id}\n${item.content}`).join('\n\n');
  // Sem Gemini, devolve os trechos relevantes para manter o fluxo local testável.
  if (!hasGemini()) return { answer: `Com base nas fontes, encontrei:\n\n${results.slice(0, 3).map((item) => `- ${item.content}`).join('\n')}`, citations: results.map((item) => ({ sourceId: item.sourceId, sourceTitle: item.sourceTitle, chunkId: item.id })), grounded: true };
  // Instrui o modelo a ensinar, citar fontes e declarar limites do contexto disponível.
  const prompt = `Voce e um professor especialista em certificacoes de IA. Responda em portugues do Brasil, com didatica, precisao e honestidade epistemica. Use somente o CONTEXTO abaixo; se ele nao bastar, diga explicitamente o que falta. Explique conceitos, destaque armadilhas de prova e termine com uma pergunta de verificacao. Cite as fontes usando [1], [2].\n\nPERGUNTA:\n${question}\n\nCONTEXTO:\n${context}`;
  const answer = await getLlm().generate(prompt);
  return { answer, citations: results.map((item) => ({ sourceId: item.sourceId, sourceTitle: item.sourceTitle, chunkId: item.id })), grounded: true };
}

// Gera questões objetivas com base no tópico encontrado no RAG.
export async function createQuiz(topic: string, count = 5): Promise<QuizQuestion[]> {
  const context = contextBlock(topic, 8);
  if (!context) return [];
  // No modo sem chave, usa questões simples derivadas diretamente das fontes.
  if (!hasGemini()) return fallbackQuiz(topic, count);
  // Pede JSON estrito para que a API consiga devolver uma estrutura previsível ao cliente.
  const prompt = `Crie ${count} questoes de quiz sobre ${topic}, baseadas somente no contexto. Retorne exclusivamente JSON valido no formato [{"question":"...","options":["...","...","...","..."],"answer":0,"explanation":"...","sourceChunkId":"..."}]. answer e o indice zero-based. Cada explicacao deve ensinar o raciocinio. CONTEXTO:\n${context}`;
  const raw = await getLlm().generate(prompt);
  // Se o modelo devolver Markdown ou JSON inválido, mantém o serviço funcional com fallback.
  try { return JSON.parse(raw.replace(/^```json\s*|\s*```$/g, '').trim()) as QuizQuestion[]; } catch { return fallbackQuiz(topic, count); }
}

// Empacota o quiz em um formato de simulado com regra de aprovação.
export async function createMockExam(topic: string, count = 10) {
  const questions = await createQuiz(topic, count);
  return { title: `Simulado: ${topic}`, instructions: 'Responda sem consultar as fontes. Revise as explicacoes depois.', questions, passingScore: Math.ceil(questions.length * 0.7) };
}

// Cria uma questão mínima por chunk quando o Gemini não está disponível.
function fallbackQuiz(topic: string, count: number): QuizQuestion[] {
  const results = searchChunks(topic, count);
  return results.map((item) => ({ question: `Qual afirmacao e sustentada pela fonte sobre ${topic}?`, options: [item.content.slice(0, 180), 'A fonte nao aborda esse assunto.', 'A informacao depende apenas de opiniao.', 'Nenhuma das anteriores.'], answer: 0, explanation: `A resposta esta diretamente fundamentada no trecho da fonte ${item.sourceTitle}.`, sourceChunkId: item.id }));
}
