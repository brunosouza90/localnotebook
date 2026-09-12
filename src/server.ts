import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { config } from './config.js';
import { listSources } from './db.js';
import { agent } from '../runtime/orchestrator.js';

// Instancia a API HTTP com logs para facilitar diagnóstico durante o desenvolvimento.
const app = Fastify({ logger: true });
// Permite que um frontend local faça chamadas para a API.
await app.register(cors, { origin: config.corsOrigin });

// Endpoint simples para monitoramento e verificação da configuração do provedor.
app.get('/health', async () => ({ status: 'ok', provider: 'gemini', configured: Boolean(config.geminiApiKey) }));
// Lista somente os metadados das fontes disponíveis no RAG.
app.get('/api/sources', async () => ({ sources: listSources() }));
// Recebe texto ou URL, valida os dados e inicia a ingestão da fonte.
app.post('/api/sources', async (request, reply) => {
  try {
    const body = z.object({ title: z.string().min(2), content: z.string().optional(), url: z.string().url().optional(), type: z.enum(['text', 'url', 'file']).optional() }).parse(request.body);
    return await agent.ingest(body);
  } catch (error) { return reply.code(400).send({ error: error instanceof Error ? error.message : 'Entrada invalida.' }); }
});
// Encaminha uma pergunta ao tutor e devolve resposta com citações.
app.post('/api/ask', async (request, reply) => {
  try { const body = z.object({ question: z.string().min(3) }).parse(request.body); return await agent.ask(body.question); }
  catch (error) { return reply.code(400).send({ error: error instanceof Error ? error.message : 'Entrada invalida.' }); }
});
// Gera um quiz limitado ao tópico e ao número de questões solicitados.
app.post('/api/quiz', async (request, reply) => {
  try { const body = z.object({ topic: z.string().min(2), count: z.number().int().min(1).max(20).default(5) }).parse(request.body); return { topic: body.topic, questions: await agent.quiz(body.topic, body.count) }; }
  catch (error) { return reply.code(400).send({ error: error instanceof Error ? error.message : 'Entrada invalida.' }); }
});
// Gera um simulado completo com instruções e nota mínima.
app.post('/api/mock-exam', async (request, reply) => {
  try { const body = z.object({ topic: z.string().min(2), count: z.number().int().min(1).max(50).default(10) }).parse(request.body); return await agent.mockExam(body.topic, body.count); }
  catch (error) { return reply.code(400).send({ error: error instanceof Error ? error.message : 'Entrada invalida.' }); }
});

// Expõe a API em todas as interfaces para uso local ou por um frontend separado.
app.listen({ port: config.port, host: '0.0.0.0' }).then(() => console.log(`Certifica AI Tutor em http://localhost:${config.port}`));
