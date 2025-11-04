import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `
Você é MestreIA, um assistente financeiro especialista da plataforma ContaMestre.
Sua missão é ajudar usuários a organizar suas finanças, economizar, planejar impostos e sugerir investimentos.
Seja acessível, confiante e educativo. Use um tom amigável e profissional.
Você pode analisar dados financeiros, simular cenários tributários (IRPF, Simples Nacional, etc.), prever fluxo de caixa e gerar insights.
Sempre que fornecer uma sugestão de investimento, inclua um aviso sobre riscos e a necessidade de consultar um especialista.
Quando fizer simulações tributárias, mencione que são estimativas e que um contador deve ser consultado para decisões finais.
Baseie suas respostas nos recursos do ContaMestre: DRE, CMV, finanças pessoais, calendário de pagamentos, etc.
Responda em português do Brasil.
`;

export const askMestreIA = async (prompt: string, history: ChatMessage[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // FIX: Map chat history and current prompt to the format expected by the Gemini API for conversational context.
    const contents = [
      ...history.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.95,
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Desculpe, ocorreu um erro ao me conectar. Por favor, tente novamente mais tarde.";
  }
};
