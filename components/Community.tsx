import React, { useState, useRef, useCallback } from 'react';
import { 
    UserCircleIcon, PlusIcon, ChatBubbleOvalLeftEllipsisIcon, ShareIcon, PhotoIcon, 
    VideoCameraIcon, FaceSmileIcon, ChartBarSquareIcon, XMarkIcon, HandThumbUpIcon, 
    HandThumbDownIcon, PinIcon, PaperAirplaneIcon
} from './icons/Icons';
import { CommunityPost, CommunityTopic, UserProfile, Comment, Poll, PollOption } from '../types';

const initialPosts: CommunityPost[] = [];

const EMOJIS = ['😀', '😂', '😍', '🤔', '😢', '🔥', '👍', '❤️', '🚀', '🎉'];
const GIFS = [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3dhdGwydjRrejJ2ZDY5d2N2Y2J2NXQ0b3N6MW5tZnVscXN2NTV6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abKhOpu0NwenH3O/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG9iN2djaXN3dzJ6MDB5Z3g2dDR6N25qZzB2MHo4a2hpZWRxNmgzcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/h72aOfbnZ6iB2/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmg3N2k1dWJsdHVzb3N4aGtxZDR3bGNpN3Q0N3I0Z2t2bjNicnI4ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZVik7pBsviNHlCthH4/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXowcXhqYmZzZ2R6b3h0aGg0c3J6cnljbGN0dGZtZmN0cWJ2OHlzYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6UB3VhArA0AxlIo0/giphy.gif'
];


interface CommunityProps {
  userProfile: UserProfile;
}

export const Community: React.FC<CommunityProps> = ({ userProfile }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeFilter, setActiveFilter] = useState<CommunityTopic>('Todos');
  const [postMedia, setPostMedia] = useState<{type: 'image' | 'video' | 'gif' | 'poll' | null, data: any}>({type: null, data: null});
  
  const [activeReactions, setActiveReactions] = useState<{[postId: number]: 'like' | 'dislike' | null}>({});
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !postMedia.type) return;

    const newPost: CommunityPost = {
      id: Date.now(),
      author: userProfile.name,
      authorAvatar: userProfile.avatar,
      topic: 'Finanças Pessoais', // Default topic
      time: 'Agora',
      content: newPostContent,
      likes: 0,
      dislikes: 0,
      comments: [],
      pinnedCommentId: null,
      imageUrl: postMedia.type === 'image' ? postMedia.data : null,
      videoUrl: postMedia.type === 'video' ? postMedia.data : null,
      gifUrl: postMedia.type === 'gif' ? postMedia.data : null,
      poll: postMedia.type === 'poll' ? postMedia.data : null,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setPostMedia({type: null, data: null});
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
      const file = e.target.files?.[0];
      if (file) {
          if (type === 'video' && file.size > 15 * 1024 * 1024) { // Basic size check for ~15s video
              alert("Vídeo muito grande. Tente um com menos de 15 segundos.");
              return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
              setPostMedia({ type, data: event.target?.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleReaction = useCallback((postId: number, reaction: 'like' | 'dislike') => {
      setPosts(currentPosts => currentPosts.map(p => {
          if (p.id !== postId) return p;

          const currentReaction = activeReactions[postId];
          let newLikes = p.likes;
          let newDislikes = p.dislikes;

          if (currentReaction === reaction) { // User is undoing their reaction
              if (reaction === 'like') newLikes--;
              else newDislikes--;
          } else { // New reaction or switching reaction
              if (reaction === 'like') newLikes++;
              else newDislikes++;
              
              if (currentReaction === 'like') newLikes--;
              if (currentReaction === 'dislike') newDislikes--;
          }
          return { ...p, likes: newLikes, dislikes: newDislikes };
      }));
      setActiveReactions(prev => ({
          ...prev,
          [postId]: activeReactions[postId] === reaction ? null : reaction,
      }));
  }, [activeReactions]);
  
  const handleToggleComments = useCallback((postId: number) => {
      setExpandedComments(prev => {
          const newSet = new Set(prev);
          if (newSet.has(postId)) {
              newSet.delete(postId);
          } else {
              newSet.add(postId);
          }
          return newSet;
      });
  }, []);

  const handleAddComment = useCallback((postId: number, content: string) => {
      const newComment: Comment = {
          id: Date.now(),
          author: userProfile.name,
          authorAvatar: userProfile.avatar,
          content,
          time: 'Agora'
      };
      setPosts(prevPosts => prevPosts.map(p => 
          p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      ));
  }, [userProfile]);
  
  const handlePinComment = useCallback((postId: number, commentId: number | null) => {
      setPosts(prevPosts => prevPosts.map(p => {
          if (p.id !== postId) return p;
          // If pinning the same comment, unpin it. Otherwise, set the new pinned comment.
          const newPinnedId = p.pinnedCommentId === commentId ? null : commentId;
          return { ...p, pinnedCommentId: newPinnedId };
      }));
  }, []);
  
  const handleVote = useCallback((postId: number, optionId: number) => {
      setPosts(prevPosts => prevPosts.map(p => {
          if (p.id !== postId || !p.poll) return p;
          const newOptions = p.poll.options.map(opt =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return { ...p, poll: { ...p.poll, options: newOptions } };
      }));
  }, []);

  const filteredPosts = posts.filter(post => activeFilter === 'Todos' || post.topic === activeFilter);
  const topics: CommunityTopic[] = ['Todos', 'Finanças Pessoais', 'Investimentos', 'PJ & MEI'];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-dark-gray mb-6">Comunidade</h2>

      <CreatePostForm
        userProfile={userProfile}
        content={newPostContent}
        setContent={setNewPostContent}
        media={postMedia}
        setMedia={setPostMedia}
        onSubmit={handlePostSubmit}
        imageInputRef={imageInputRef}
        videoInputRef={videoInputRef}
        onFileInputChange={handleFileChange}
      />

      {/* Filters */}
      <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
          {topics.map(topic => (
               <button
                  key={topic}
                  onClick={() => setActiveFilter(topic)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${
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
          {filteredPosts.length > 0 ? filteredPosts.map(post => (
              <PostCard 
                  key={post.id}
                  post={post}
                  userProfile={userProfile}
                  userReaction={activeReactions[post.id] || null}
                  isCommentsExpanded={expandedComments.has(post.id)}
                  onReaction={handleReaction}
                  onToggleComments={handleToggleComments}
                  onAddComment={handleAddComment}
                  onPinComment={handlePinComment}
                  onVote={handleVote}
              />
          )) : (
            <div className="text-center py-10 bg-white rounded-2xl shadow-md">
              <p className="text-gray-500">Ainda não há publicações.</p>
              <p className="text-sm text-gray-400 mt-2">Seja o primeiro a compartilhar uma dica ou fazer uma pergunta!</p>
            </div>
          )}
      </div>
    </div>
  );
};


// Sub-components for better organization

const CreatePostForm: React.FC<any> = ({ userProfile, content, setContent, media, setMedia, onSubmit, imageInputRef, videoInputRef, onFileInputChange }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);

    const handleEmojiSelect = (emoji: string) => {
        setContent(content + emoji);
        setShowEmojiPicker(false);
    }
    
    const createPoll = () => {
        setMedia({type: 'poll', data: { question: '', options: [{id: 1, text: '', votes: 0}, {id: 2, text: '', votes: 0}]}})
    }
    
    return (
        <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
            <div className="flex items-start space-x-4">
                {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Seu avatar" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <UserCircleIcon className="w-10 h-10 text-gray-400"/>
                )}
                <form onSubmit={onSubmit} className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent transition"
                        rows={3}
                        placeholder="Compartilhe uma dica ou faça uma pergunta..."
                    ></textarea>

                    {media.type === 'image' && <MediaPreview src={media.data} onRemove={() => setMedia({type: null, data: null})} />}
                    {media.type === 'video' && <MediaPreview src={media.data} onRemove={() => setMedia({type: null, data: null})} isVideo />}
                    {media.type === 'gif' && <MediaPreview src={media.data} onRemove={() => setMedia({type: null, data: null})} />}
                    {media.type === 'poll' && <PollCreator poll={media.data} setPoll={(pollData: Poll) => setMedia({type: 'poll', data: pollData})} />}

                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 text-gray-500 relative">
                            <input type="file" ref={imageInputRef} onChange={(e) => onFileInputChange(e, 'image')} className="hidden" accept="image/*" />
                            <input type="file" ref={videoInputRef} onChange={(e) => onFileInputChange(e, 'video')} className="hidden" accept="video/*" />
                            
                            <IconButton icon={<PhotoIcon />} onClick={() => imageInputRef.current?.click()} tooltip="Imagem" />
                            <IconButton icon={<VideoCameraIcon />} onClick={() => videoInputRef.current?.click()} tooltip="Vídeo (15s)" />
                            <IconButton icon={<FaceSmileIcon />} onClick={() => setShowEmojiPicker(!showEmojiPicker)} tooltip="Emoji" />
                            {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
                            <IconButton icon={<ChartBarSquareIcon />} onClick={createPoll} tooltip="Enquete" />
                            <button onClick={() => setShowGifPicker(true)} type="button" className="text-gray-500 font-bold text-xs p-2 rounded-full hover:bg-gray-100">GIF</button>
                            {showGifPicker && <GifPickerModal onSelect={(gif) => { setMedia({type: 'gif', data: gif}); setShowGifPicker(false); }} onClose={() => setShowGifPicker(false)}/>}
                        </div>
                        <button type="submit" className="flex items-center bg-primary-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:bg-gray-300" disabled={!content.trim() && !media.type}>
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Publicar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const PostCard: React.FC<any> = ({ post, userProfile, userReaction, isCommentsExpanded, onReaction, onToggleComments, onAddComment, onPinComment, onVote }) => {
    const [shareStatus, setShareStatus] = useState('Compartilhar');
    
    const handleShare = () => {
        const postUrl = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(postUrl).then(() => {
            setShareStatus('Copiado!');
            setTimeout(() => setShareStatus('Compartilhar'), 2000);
        });
    };

    return (
        <div className="bg-white p-5 rounded-2xl shadow-md">
            <div className="flex items-center mb-3">
                 {post.authorAvatar ? (
                    <img src={post.authorAvatar} alt={`${post.author} avatar`} className="w-10 h-10 rounded-full object-cover mr-3" />
                ) : (
                    <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3"/>
                )}
                <div>
                    <p className="font-bold text-dark-gray">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.topic} · {post.time}</p>
                </div>
            </div>
            {post.content && <p className="text-dark-gray leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>}

            {/* Media Content */}
            {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="mt-3 rounded-lg w-full object-cover" />}
            {post.videoUrl && <video src={post.videoUrl} controls className="mt-3 rounded-lg w-full" />}
            {post.gifUrl && <img src={post.gifUrl} alt="Post gif" className="mt-3 rounded-lg" />}
            {post.poll && <PollDisplay poll={post.poll} onVote={(optionId) => onVote(post.id, optionId)} />}

            <div className="flex items-center text-gray-500 space-x-4 text-sm pt-3 border-t border-gray-100">
                <button className={`flex items-center space-x-1.5 hover:text-primary-green transition-colors ${userReaction === 'like' ? 'text-primary-green font-bold' : ''}`} onClick={() => onReaction(post.id, 'like')}>
                    <HandThumbUpIcon className={`w-5 h-5 ${userReaction === 'like' ? 'fill-current' : ''}`}/>
                    <span>{post.likes}</span>
                </button>
                 <button className={`flex items-center space-x-1.5 hover:text-red-500 transition-colors ${userReaction === 'dislike' ? 'text-red-500 font-bold' : ''}`} onClick={() => onReaction(post.id, 'dislike')}>
                    <HandThumbDownIcon className={`w-5 h-5 ${userReaction === 'dislike' ? 'fill-current' : ''}`}/>
                    <span>{post.dislikes}</span>
                </button>
                 <button className="flex items-center space-x-1.5 hover:text-primary-green transition-colors" onClick={() => onToggleComments(post.id)}>
                    <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5"/>
                    <span>{post.comments.length} Comentários</span>
                </button>
                 <button className="flex items-center space-x-1.5 hover:text-primary-green transition-colors ml-auto" onClick={handleShare}>
                    <ShareIcon className="w-5 h-5"/>
                    <span>{shareStatus}</span>
                </button>
            </div>
            
            {isCommentsExpanded && <CommentSection post={post} userProfile={userProfile} onAddComment={onAddComment} onPinComment={onPinComment} />}
        </div>
    );
}

const CommentSection: React.FC<any> = ({ post, userProfile, onAddComment, onPinComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        onAddComment(post.id, newComment);
        setNewComment('');
    };
    
    const pinnedComment = post.comments.find((c: Comment) => c.id === post.pinnedCommentId);
    const otherComments = post.comments.filter((c: Comment) => c.id !== post.pinnedCommentId);

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Pinned Comment */}
            {pinnedComment && (
                <div className="p-3 bg-green-50 rounded-lg mb-3 border border-primary-green/50">
                     <div className="flex items-center gap-2 mb-2">
                        <PinIcon className="w-4 h-4 text-primary-green"/>
                        <p className="text-xs font-semibold text-primary-green">Comentário Fixado</p>
                    </div>
                    <CommentItem comment={pinnedComment} isPostAuthor={post.author === userProfile.name} onPin={() => onPinComment(post.id, pinnedComment.id)} isPinned={true} />
                </div>
            )}

            {/* Other Comments */}
            <div className="space-y-3">
                {otherComments.map((comment: Comment) => (
                    <CommentItem key={comment.id} comment={comment} isPostAuthor={post.author === userProfile.name} onPin={() => onPinComment(post.id, comment.id)} isPinned={false} />
                ))}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="flex items-start space-x-3 mt-4">
                {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Seu avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                )}
                <div className="flex-1 flex items-center bg-light-gray rounded-full px-1">
                     <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escreva um comentário..."
                        className="flex-1 w-full bg-transparent py-2 px-3 text-sm placeholder-gray-500 focus:outline-none"
                    />
                    <button type="submit" className="p-2 text-primary-green rounded-full hover:bg-green-100 disabled:text-gray-400" disabled={!newComment.trim()}>
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

const CommentItem: React.FC<any> = ({ comment, isPostAuthor, onPin, isPinned }) => (
    <div className="flex items-start space-x-3 text-sm">
        {comment.authorAvatar ? (
            <img src={comment.authorAvatar} alt={`${comment.author} avatar`} className="w-8 h-8 rounded-full object-cover" />
        ) : (
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
        )}
        <div className="flex-1 bg-light-gray p-3 rounded-xl">
            <div className="flex justify-between items-center">
                <div>
                    <span className="font-bold text-dark-gray">{comment.author}</span>
                    <span className="text-xs text-gray-500 ml-2">{comment.time}</span>
                </div>
                 {isPostAuthor && (
                    <button onClick={onPin} title={isPinned ? 'Desafixar comentário' : 'Fixar comentário'} className={`text-gray-400 hover:text-primary-green ${isPinned ? 'text-primary-green' : ''}`}>
                        <PinIcon className="w-4 h-4"/>
                    </button>
                )}
            </div>
            <p className="text-dark-gray mt-1">{comment.content}</p>
        </div>
    </div>
);

const MediaPreview: React.FC<{src: string, onRemove: () => void, isVideo?: boolean}> = ({src, onRemove, isVideo}) => (
    <div className="relative mt-2">
        {isVideo ? <video src={src} className="w-full max-h-60 rounded-lg" controls /> : <img src={src} className="w-full max-h-60 object-cover rounded-lg" />}
        <button onClick={onRemove} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"><XMarkIcon className="w-4 h-4"/></button>
    </div>
)

const PollCreator: React.FC<{poll: Poll, setPoll: (poll: Poll) => void}> = ({poll, setPoll}) => {
    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPoll({ ...poll, question: e.target.value });
    };
    const handleOptionChange = (id: number, text: string) => {
        const newOptions = poll.options.map(opt => opt.id === id ? { ...opt, text } : opt);
        setPoll({ ...poll, options: newOptions });
    };
    const addOption = () => {
        if(poll.options.length < 4) {
            const newId = Date.now();
            setPoll({...poll, options: [...poll.options, {id: newId, text: '', votes: 0}]})
        }
    }
    return (
        <div className="border-t mt-3 pt-3 space-y-2">
            <input type="text" placeholder="Sua pergunta da enquete..." value={poll.question} onChange={handleQuestionChange} className="w-full border-gray-200 rounded-lg text-sm" />
            {poll.options.map((opt, index) => <input key={opt.id} type="text" placeholder={`Opção ${index + 1}`} value={opt.text} onChange={(e) => handleOptionChange(opt.id, e.target.value)} className="w-full border-gray-200 rounded-lg text-sm" />)}
            {poll.options.length < 4 && <button type="button" onClick={addOption} className="text-sm text-primary-green font-semibold">+ Adicionar opção</button>}
        </div>
    )
}

const PollDisplay: React.FC<{ poll: Poll; onVote: (optionId: number) => void }> = ({ poll, onVote }) => {
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const POLL_COLORS = [
        { light: 'bg-teal-50 text-teal-800 border-teal-200', dark: 'bg-teal-400' },
        { light: 'bg-sky-50 text-sky-800 border-sky-200', dark: 'bg-sky-400' },
        { light: 'bg-amber-50 text-amber-800 border-amber-200', dark: 'bg-amber-400' },
        { light: 'bg-rose-50 text-rose-800 border-rose-200', dark: 'bg-rose-400' },
    ];

    return (
        <div className="mt-3 space-y-2">
            <h4 className="font-bold text-dark-gray">{poll.question}</h4>
            {poll.options.map((opt, index) => {
                const color = POLL_COLORS[index % POLL_COLORS.length];
                const percentage = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                return (
                    <div key={opt.id} className={`relative border rounded-lg p-3 text-sm cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md ${color.light}`} onClick={() => onVote(opt.id)}>
                        <div className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${color.dark}`} style={{ width: `${percentage}%` }}></div>
                        <div className="relative flex justify-between font-semibold">
                            <span>{opt.text}</span>
                            <span>{`${Math.round(percentage)}%`}</span>
                        </div>
                    </div>
                );
            })}
            <p className="text-xs text-gray-500 text-right">{totalVotes} votos</p>
        </div>
    );
};

const IconButton: React.FC<{icon: React.ReactNode, onClick: () => void, tooltip: string}> = ({icon, onClick, tooltip}) => (
    <button type="button" onClick={onClick} title={tooltip} className="p-2 rounded-full hover:bg-gray-100">
        {icon}
    </button>
)

const EmojiPicker: React.FC<{onSelect: (emoji: string) => void}> = ({onSelect}) => (
    <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-lg p-2 grid grid-cols-5 gap-1 border z-10">
        {EMOJIS.map(emoji => <button key={emoji} type="button" onClick={() => onSelect(emoji)} className="text-xl p-1 rounded-md hover:bg-gray-100">{emoji}</button>)}
    </div>
)

const GifPickerModal: React.FC<{onSelect: (gifUrl: string) => void, onClose: () => void}> = ({onSelect, onClose}) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-4 w-full max-w-sm">
            <h4 className="font-bold mb-2">Selecione um GIF</h4>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {GIFS.map(gif => <img key={gif} src={gif} onClick={() => onSelect(gif)} className="cursor-pointer rounded hover:ring-2 ring-primary-green" />)}
            </div>
            <button onClick={onClose} className="mt-4 w-full text-center bg-light-gray p-2 rounded-lg">Fechar</button>
        </div>
    </div>
)
