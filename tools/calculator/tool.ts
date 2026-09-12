// Calcula nota e aprovacao de um quiz ou simulado sem depender do modelo.
export function calculateScore(answered: number[], correct: number[]) {
  const total = correct.length;
  const hits = answered.reduce((score, answer, index) => score + (answer === correct[index] ? 1 : 0), 0);
  return { hits, total, percentage: total ? Math.round((hits / total) * 100) : 0 };
}
