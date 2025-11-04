import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserData } from '../types';
import { askMestreIA } from '../services/geminiService';
import { PaperAirplaneIcon, SparklesIcon } from './icons/Icons';

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl ${
          isUser
            ? 'bg-primary-green text-white rounded-br-none'
            : 'bg-white text-dark-gray rounded-bl-none shadow-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

interface MestreIAChatProps {
  userData: UserData;
}

export const MestreIAChat: React.FC<MestreIAChatProps> = ({ userData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Olá! Sou o MestreIA, seu assistente financeiro pessoal. Como posso te ajudar a organizar suas finanças hoje?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await askMestreIA(input, messages, userData);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'model',
        text: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const quickActions = [
    "Qual foi meu maior gasto este mês?",
    "Me dê um resumo da minha saúde financeira.",
    "Estou no caminho certo para minha meta de viagem?",
    "Crie um plano de economia para uma viagem."
  ]

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-light-gray">
      <div className="flex items-center p-4 border-b border-gray-200 bg-white rounded-t-2xl">
        <div className="p-2 bg-green-100 rounded-full mr-3">
          <SparklesIcon className="w-6 h-6 text-primary-green" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-dark-gray">MestreIA</h2>
            <p className="text-sm text-gray-500">Seu assistente financeiro inteligente</p>
        </div>
      </div>
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-dark-gray px-5 py-3 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

       {messages.length <= 1 && (
         <div className="px-6 pb-2">
            <p className="text-sm text-gray-500 mb-2">Sugestões rápidas:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickActions.map(action => (
                     <button key={action} onClick={() => setInput(action)} className="text-left text-sm p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                        {action}
                     </button>
                ))}
            </div>
         </div>
       )}

      <div className="p-4 bg-white rounded-b-2xl border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao MestreIA..."
            className="flex-1 w-full bg-light-gray border-transparent rounded-lg py-3 px-4 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-primary-green text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};