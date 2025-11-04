// FIX: Import React to resolve React-related type errors.
import React from 'react';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  urgency: 'high' | 'medium' | 'low';
  time?: string;
  notes?: string;
  reminder: 'none' | '1h' | '1d' | '2d';
}

export interface Goal {
    id: number;
    name: string;
    icon: React.ReactElement;
    currentAmount: number;
    targetAmount: number;
    targetDate: string;
}

export interface Kpi {
    title: string;
    value: string;
    change?: string;
    changeType: "increase" | "decrease" | "none";
    icon: React.ReactNode;
    subtext?: string;
}

// A generic structure to hold all user data for the AI context
export interface UserData {
  dashboard: Kpi[];
  transactions: Transaction[];
  calendarEvents: CalendarEvent[];
  goals: Goal[];
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  profession: string;
  website: string;
  avatar: string | null;
  coverPhoto: string | null;
}

export type CommunityTopic = 'Todos' | 'Finanças Pessoais' | 'Investimentos' | 'PJ & MEI';

export interface Comment {
    id: number;
    author: string;
    authorAvatar: string | null;
    content: string;
    time: string;
}

export interface PollOption {
    id: number;
    text: string;
    votes: number;
}

export interface Poll {
    question: string;
    options: PollOption[];
}


export interface CommunityPost {
    id: number;
    author: string;
    authorAvatar: string | null;
    topic: CommunityTopic;
    time: string;
    content: string;
    likes: number;
    dislikes: number;
    comments: Comment[];
    pinnedCommentId: number | null;
    imageUrl: string | null;
    videoUrl: string | null;
    gifUrl: string | null;
    poll: Poll | null;
}