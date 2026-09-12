export type SourceType = 'text' | 'url' | 'file';

// Representa a fonte original usada para alimentar a base de conhecimento.
export interface Source {
  id: string;
  title: string;
  type: SourceType;
  uri?: string;
  createdAt: string;
}

// Armazena um trecho menor da fonte para facilitar a recuperação de contexto.
export interface Chunk {
  id: string;
  sourceId: string;
  content: string;
  position: number;
  tokenCount: number;
}

// Adiciona a pontuação da busca e o título da fonte ao chunk recuperado.
export interface SearchResult extends Chunk {
  sourceTitle: string;
  score: number;
}

// Contrato de resposta do tutor, incluindo as evidências utilizadas.
export interface TutorAnswer {
  answer: string;
  citations: Array<{ sourceId: string; sourceTitle: string; chunkId: string }>;
  grounded: boolean;
}

// Estrutura comum para questões geradas pelo quiz e pelo simulado.
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  sourceChunkId: string;
}
