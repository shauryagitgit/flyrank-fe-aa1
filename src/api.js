export async function requestAssistant(message) {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    parts: [
      { type: 'text', text: `I received: “${message}”` },
      { type: 'tool', name: 'rank_pages', status: 'complete', result: '3 pages scored' },
      { type: 'code', language: 'js', code: 'return rankedPages.slice(0, 3);' },
    ],
  };
}
