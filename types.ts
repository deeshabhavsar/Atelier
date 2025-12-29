/**
 * Centralized TypeScript type definitions.
 * Defines the core data structures for the Atelier platform, including Artists, Jobs, Conversations, and Sessions.
 */
export type UserType = 'artist' | 'client';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  medium: string;
  year: string;
  tags: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface ArtistProfile {
  id: string;
  name: string;
  headline: string;
  location: string;
  bio: string;
  avatar: string;
  banner: string;
  skills: string[];
  mediums: string[];
  portfolio: PortfolioItem[];
  experience: Experience[];
  isFeatured: boolean;
  isAvailable: boolean;
  availabilityStatus: 'Available' | 'Busy' | 'Booked';
  pricing: {
    min: number;
    max: number;
    unit: 'project' | 'hour';
  };
  collabPreferences: {
    isOpen: boolean;
    types: string[];
    style: 'remote' | 'in-person' | 'hybrid';
  };
}

export interface Job {
  id: string;
  title: string;
  company: string;
  category: 'commission' | 'freelance' | 'full-time' | 'collaboration';
  description: string;
  budget: string;
  skills: string[];
  deadline: string;
  postedBy: string; // client id
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  sharedPortfolioId?: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // user ids
  messages: Message[];
}

export interface CollabRequest {
  id: string;
  fromId: string;
  toId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  type: UserType;
  profileId?: string;
}