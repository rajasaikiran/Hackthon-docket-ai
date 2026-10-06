export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  columns?: string[];
  rows?: Record<string, unknown>[];
  error?: boolean;
}
