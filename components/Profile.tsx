import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { CameraIcon, BriefcaseIcon, LinkIcon, UserCircleIcon, PencilIcon } from './icons/Icons';

interface ProfileProps {
    profile: UserProfile;
    onUpdate: (updatedProfile: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'coverPhoto') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Cover Photo */}
                <div className="h-48 bg-light-gray relative group">
                    {formData.coverPhoto ? (
                        <img src={formData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-green-100 to-teal-100"></div>
                    )}
                    {isEditing && (
                        <button 
                            onClick={() => coverInputRef.current?.click()}
                            className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                        >
                            <CameraIcon className="w-5 h-5 text-dark-gray" />
                            <input type="file" ref={coverInputRef} onChange={(e) => handleFileChange(e, 'coverPhoto')} className="hidden" accept="image/*"/>
                        </button>
                    )}
                </div>

                {/* Profile Header */}
                <div className="px-6 pb-6 -mt-16">
                    <div className="flex items-end justify-between">
                         {/* Avatar */}
                        <div className="relative group">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
                            ) : (
                                <UserCircleIcon className="w-32 h-32 text-gray-300 bg-white rounded-full border-4 border-white shadow-md" />
                            )}
                            {isEditing && (
                                <button 
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <CameraIcon className="w-8 h-8 text-white" />
                                    <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" accept="image/*"/>
                                </button>
                            )}
                        </div>
                        {isEditing ? (
                             <div className="flex gap-2">
                                <button onClick={handleCancel} className="px-4 py-2 text-sm bg-light-gray text-dark-gray rounded-lg hover:bg-gray-200 font-semibold">Cancelar</button>
                                <button onClick={handleSave} className="px-4 py-2 text-sm bg-primary-green text-white rounded-lg hover:bg-green-800 font-semibold">Salvar</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-light-gray font-semibold">
                                <PencilIcon className="w-4 h-4"/>
                                Editar Perfil
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Profile Info */}
                <div className="p-6 pt-0 space-y-6">
                   {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500">Nome</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full text-2xl font-bold text-dark-gray border-b-2 p-1 focus:outline-none focus:border-primary-green"/>
                            </div>
                             <div>
                                <label className="text-xs text-gray-500">Profissão</label>
                                <input type="text" name="profession" value={formData.profession} onChange={handleInputChange} className="w-full text-sm text-gray-600 border-b-2 p-1 focus:outline-none focus:border-primary-green"/>
                            </div>
                        </div>
                   ) : (
                        <div>
                            <h2 className="text-3xl font-bold text-dark-gray">{profile.name}</h2>
                            <p className="text-md text-gray-500">{profile.profession}</p>
                        </div>
                   )}

                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="font-semibold text-dark-gray mb-2">Sobre</h3>
                        {isEditing ? (
                             <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} className="w-full text-sm text-dark-gray border-b-2 p-1 focus:outline-none focus:border-primary-green"></textarea>
                        ) : (
                            <p className="text-sm text-dark-gray leading-relaxed">{profile.bio}</p>
                        )}
                    </div>

                     <div className="pt-4 border-t border-gray-100">
                        <h3 className="font-semibold text-dark-gray mb-2">Website</h3>
                         {isEditing ? (
                             <input type="text" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://exemplo.com" className="w-full text-sm text-blue-600 border-b-2 p-1 focus:outline-none focus:border-primary-green"/>
                         ) : (
                            profile.website ? (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-green hover:underline flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4"/>
                                    {profile.website}
                                </a>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Nenhum site adicionado.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};