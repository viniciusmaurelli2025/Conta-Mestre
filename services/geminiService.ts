import { GoogleGenAI } from "@google/genai";
import { ChatMessage, UserData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `
Você é MestreIA, um assistente financeiro especialista da plataforma ContaMestre.
Sua missão é ajudar usuários a organizar suas finanças, economizar, planejar impostos e sugerir investimentos.
Seja acessível, confiante e educativo. Use um tom amigável e profissional.

IMPORTANTE: Você terá acesso a um objeto JSON com os dados financeiros do usuário. Use esses dados como a ÚNICA fonte de verdade para suas análises e respostas. Os dados incluem: dashboard, transações, eventos de calendário (contas a pagar/receber) e metas financeiras.

Analise os dados fornecidos para responder às perguntas do usuário de forma precisa e personalizada.
Você pode analisar dados financeiros, simular cenários tributários (IRPF, Simples Nacional, etc.), prever fluxo de caixa e gerar insights.
Sempre que fornecer uma sugestão de investimento, inclua um aviso sobre riscos e a necessidade de consultar um especialista.
Quando fizer simulações tributárias, mencione que são estimativas e que um contador deve ser consultado para decisões finais.
Baseie suas respostas nos recursos do ContaMestre: DRE, CMV, finanças pessoais, calendário de pagamentos, etc., usando os dados fornecidos no JSON.
Responda em português do Brasil.
`;

export const askMestreIA = async (prompt: string, history: ChatMessage[], userData: UserData): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';

    const contextualPrompt = `
Aqui estão os dados financeiros atuais do usuário:
${JSON.stringify(userData, null, 2)}

Com base nos dados acima, responda à seguinte pergunta do usuário:
"${prompt}"
`;
    
    // FIX: Map chat history and current prompt to the format expected by the Gemini API for conversational context.
    const contents = [
      ...history.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
      {
        role: 'user',
        parts: [{ text: contextualPrompt }],
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
    return "Desculpe, ocorreu um erro ao analisar seus dados. Por favor, tente novamente mais tarde.";
  }
};