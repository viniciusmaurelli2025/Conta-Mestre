import React, { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon } from './icons/Icons';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.319-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l6.19 5.238C42.012 35.846 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle authentication here.
    // For this mock, we'll just call the success callback.
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-light-gray flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
            <svg className="w-10 h-10 text-primary-green mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-4xl font-bold text-dark-gray">Conta<span className="text-primary-green">Mestre</span></h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-sm font-semibold transition-colors focus:outline-none ${isLogin ? 'text-primary-green border-b-2 border-primary-green' : 'text-gray-500 hover:text-dark-gray'}`}>
              Entrar
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-sm font-semibold transition-colors focus:outline-none ${!isLogin ? 'text-primary-green border-b-2 border-primary-green' : 'text-gray-500 hover:text-dark-gray'}`}>
              Criar Conta
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-dark-gray block mb-1">Nome Completo</label>
                    <input id="name" type="text" placeholder="Seu nome" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green" required />
                </div>
            )}
             <div>
                <label htmlFor="email" className="text-sm font-medium text-dark-gray block mb-1">Email</label>
                <div className="relative">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true"/>
                    <input id="email" type="email" placeholder="voce@exemplo.com" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green" required />
                </div>
            </div>
            <div>
                <label htmlFor="password" className="text-sm font-medium text-dark-gray block mb-1">Senha</label>
                 <div className="relative">
                    <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true"/>
                    <input id="password" type="password" placeholder="Sua senha" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green" required />
                </div>
            </div>
            {isLogin && (
                <div className="text-right">
                    <a href="#" className="text-sm text-primary-green hover:underline font-medium">Esqueceu sua senha?</a>
                </div>
            )}
            
            <button type="submit" className="w-full bg-primary-green text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </button>

            <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">Ou</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            <button type="button" onClick={onLoginSuccess} className="w-full flex items-center justify-center bg-white border border-gray-300 text-dark-gray py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green">
                <GoogleIcon />
                Continuar com Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
