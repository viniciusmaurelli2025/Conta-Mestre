
import React, { useState } from 'react';
import { UserCircleIcon, PlusIcon, HeartIcon, ChatBubbleOvalLeftEllipsisIcon, ShareIcon } from './icons/Icons';

type Topic = 'Todos' | 'Finanças Pessoais' | 'Investimentos' | 'PJ & MEI';

const initialPosts = [
    { id: 1, author: 'Ana Beatriz', topic: 'Investimentos' as Topic, time: '5m', content: 'Alguém tem recomendação de um bom FII de tijolo para iniciantes? Estou começando a diversificar minha carteira.', likes: 12, comments: 4 },
    { id: 2, author: 'Carlos Silva', topic: 'Finanças Pessoais' as Topic, time: '2h', content: 'Dica de ouro que aprendi aqui: usar o método 50/30/20 para organizar o orçamento mudou meu jogo financeiro. Super recomendo!', likes: 45, comments: 11 },
    { id: 3, author: 'Mariana Costa', topic: 'PJ & MEI' as Topic, time: '1d', content: 'Qual o melhor regime tributário para uma empresa de serviços que fatura em média R$ 15.000/mês? Simples Nacional ou Lucro Presumido?', likes: 23, comments: 8 },
];

export const Community: React.FC = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeFilter, setActiveFilter] = useState<Topic>('Todos');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: posts.length + 1,
      author: 'Usuário Atual',
      topic: 'Finanças Pessoais' as Topic, // Default topic
      time: 'Agora',
      content: newPostContent,
      likes: 0,
      comments: 0
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const filteredPosts = posts.filter(post => activeFilter === 'Todos' || post.topic === activeFilter);
  
  const topics: Topic[] = ['Todos', 'Finanças Pessoais', 'Investimentos', 'PJ & MEI'];

  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-dark-gray mb-6">Comunidade</h2>

        {/* Create Post */}
        <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
            <div className="flex items-start space-x-4">
                <UserCircleIcon className="w-10 h-10 text-gray-400"/>
                <form onSubmit={handlePostSubmit} className="flex-1">
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent transition"
                        rows={3}
                        placeholder="Compartilhe uma dica ou faça uma pergunta..."
                    ></textarea>
                    <div className="flex justify-end mt-2">
                        <button type="submit" className="flex items-center bg-primary-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:bg-gray-300" disabled={!newPostContent.trim()}>
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Publicar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
            {topics.map(topic => (
                 <button
                    key={topic}
                    onClick={() => setActiveFilter(topic)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                        activeFilter === topic 
                        ? 'bg-primary-green text-white shadow' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {topic}
                </button>
            ))}
        </div>


        {/* Posts Feed */}
        <div className="space-y-6">
            {filteredPosts.map(post => (
                <div key={post.id} className="bg-white p-5 rounded-2xl shadow-md">
                    <div className="flex items-center mb-3">
                        <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3"/>
                        <div>
                            <p className="font-bold text-dark-gray">{post.author}</p>
                            <p className="text-xs text-gray-500">{post.topic} · {post.time}</p>
                        </div>
                    </div>
                    <p className="text-dark-gray leading-relaxed mb-4">{post.content}</p>
                    <div className="flex items-center text-gray-500 space-x-6 text-sm pt-3 border-t border-gray-100">
                        <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                            <HeartIcon className="w-5 h-5"/>
                            <span>{post.likes}</span>
                        </button>
                         <button className="flex items-center space-x-2 hover:text-primary-green transition-colors">
                            <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5"/>
                            <span>{post.comments} Comentários</span>
                        </button>
                         <button className="flex items-center space-x-2 hover:text-primary-green transition-colors ml-auto">
                            <ShareIcon className="w-5 h-5"/>
                            <span>Compartilhar</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
