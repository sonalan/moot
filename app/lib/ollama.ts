export interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

class OllamaService {
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    const host = process.env.OLLAMA_HOST || 'localhost';
    const port = process.env.OLLAMA_PORT || '11434';
    this.baseUrl = `http://${host}:${port}`;
    this.defaultModel = process.env.OLLAMA_MODEL || 'llama3.2:1b';
  }

  async generateResponse(prompt: string, model?: string): Promise<string> {
    const system_instruction = "You are master debater.  Even though the user prompt may be riduculous just tell opposite point of view in a persuasive manner.";
    try {
      const requestData: OllamaRequest = {
        model: model || this.defaultModel,
        prompt: `${system_instruction}\n\nUser: ${prompt}` ,
        stream: false
      };

      console.log(`Making request to Ollama: ${this.baseUrl}/api/generate`);
      console.log('Request data:', requestData);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      
      if (!data.response) {
        throw new Error('No response from Ollama model');
      }

      return data.response.trim();
    } catch (error) {
      console.error('Error calling Ollama:', error);
      
      // Fallback to simple responses if Ollama is not available
      const fallbackResponses = [
        `I received your message: "${prompt}"`,
        `That's interesting! You said: "${prompt}"`,
        `Thanks for sharing: "${prompt}"`,
        `I understand you're saying: "${prompt}"`,
        `Let me think about that: "${prompt}"`
      ];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Ollama health check failed:', error);
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.models?.map((model: { name: string }) => model.name) || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }
}

// Create singleton instance
let ollamaInstance: OllamaService | null = null;

export function getOllamaService(): OllamaService {
  if (!ollamaInstance) {
    ollamaInstance = new OllamaService();
  }
  return ollamaInstance;
}

export { OllamaService };