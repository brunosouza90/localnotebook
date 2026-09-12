import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config.js';

export interface Llm {
  generate(prompt: string): Promise<string>;
}

// Adaptador do Gemini que mantém o restante da aplicação independente do SDK.
class GeminiLlm implements Llm {
  private readonly model = new GoogleGenerativeAI(config.geminiApiKey!).getGenerativeModel({ model: config.geminiModel });

  async generate(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}

// Fallback determinístico para desenvolvimento e testes sem uma chave de API.
class FallbackLlm implements Llm {
  async generate(prompt: string): Promise<string> {
    return prompt;
  }
}

// Seleciona o Gemini quando configurado e mantém o sistema executável sem credenciais.
export function getLlm(): Llm {
  return config.geminiApiKey ? new GeminiLlm() : new FallbackLlm();
}

// Expõe o estado da configuração sem revelar a chave da API.
export function hasGemini(): boolean {
  return Boolean(config.geminiApiKey);
}
