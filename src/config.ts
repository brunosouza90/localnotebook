import 'dotenv/config';

// Centraliza as configurações do processo e permite sobrescrevê-las por variáveis de ambiente.
export const config = {
  port: Number(process.env.PORT ?? 3333),
  databasePath: process.env.DATABASE_PATH ?? './data/study.db',
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
  corsOrigin: process.env.CORS_ORIGIN ?? '*'
};
