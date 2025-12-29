/**
 * Global state management. 
 * Implements a React Context Provider that manages the application's data flow, 
 * including user authentication, profile updates, and interaction with the mock database.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, ArtistProfile, Job, Conversation, CollabRequest, UserType } from './types';
import { db } from './lib/db';

interface StoreContextType {
  user: UserSession | null;
  artists: ArtistProfile[];
  jobs: Job[];
  conversations: Conversation[];
  collabRequests: CollabRequest[];
  isLoading: boolean;
  login: (email: string, type: UserType) => void;
  logout: () => void;
  updateProfile: (profile: ArtistProfile) => Promise<void>;
  postJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<void>;
  sendMessage: (convoId: string, text: string, sharedPortfolioId?: string) => Promise<void>;
  sendCollabRequest: (req: Omit<CollabRequest, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateCollabStatus: (id: string, status: 'accepted' | 'declined') => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('atelier_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [collabRequests, setCollabRequests] = useState<CollabRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetch from "Database"
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const [a, j, c, cr] = await Promise.all([
          db.getArtists(),
          db.getJobs(),
          db.getConversations(),
          db.getCollabRequests()
        ]);
        setArtists(a);
        setJobs(j);
        setConversations(c);
        setCollabRequests(cr);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // Save user session separately
  useEffect(() => {
    localStorage.setItem('atelier_user', JSON.stringify(user));
  }, [user]);

  const login = (email: string, type: UserType) => {
    const name = email.split('@')[0];
    const id = `u_${Date.now()}`;
    const newUser: UserSession = { id, name, email, type };
    if (type === 'artist') {
      const existingProfile = artists.find(a => a.id === id);
      if (!existingProfile) {
        const newProfile: ArtistProfile = {
          id,
          name,
          headline: 'Emerging Artist',
          location: 'Worldwide',
          bio: 'Welcome to my creative space.',
          avatar: `https://picsum.photos/seed/${id}/400/400`,
          banner: `https://picsum.photos/seed/${id}-banner/1200/400`,
          skills: [],
          mediums: [],
          portfolio: [],
          experience: [],
          isFeatured: false,
          isAvailable: true,
          availabilityStatus: 'Available',
          pricing: { min: 0, max: 0, unit: 'project' },
          collabPreferences: { isOpen: true, types: [], style: 'remote' }
        };
        const updatedArtists = [...artists, newProfile];
        setArtists(updatedArtists);
        db.saveArtists(updatedArtists);
        newUser.profileId = id;
      }
    }
    setUser(newUser);
  };

  const logout = () => setUser(null);

  const updateProfile = async (profile: ArtistProfile) => {
    const updated = artists.map(a => a.id === profile.id ? profile : a);
    setArtists(updated);
    await db.saveArtists(updated);
  };

  const postJob = async (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: `j_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newJob, ...jobs];
    setJobs(updated);
    await db.saveJobs(updated);
  };

  const sendMessage = async (convoId: string, text: string, sharedPortfolioId?: string) => {
    if (!user) return;
    const updated = conversations.map(c => {
      if (c.id === convoId) {
        return {
          ...c,
          messages: [...c.messages, {
            id: `m_${Date.now()}`,
            senderId: user.id,
            text,
            timestamp: new Date().toISOString(),
            isRead: false,
            sharedPortfolioId
          }]
        };
      }
      return c;
    });
    setConversations(updated);
    await db.saveConversations(updated);
  };

  const sendCollabRequest = async (req: Omit<CollabRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: CollabRequest = {
      ...req,
      id: `cr_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [newReq, ...collabRequests];
    setCollabRequests(updated);
    await db.saveCollabRequests(updated);
  };

  const updateCollabStatus = async (id: string, status: 'accepted' | 'declined') => {
    const updated = collabRequests.map(r => r.id === id ? { ...r, status } : r);
    setCollabRequests(updated);
    await db.saveCollabRequests(updated);
  };

  return (
    <StoreContext.Provider value={{
      user, artists, jobs, conversations, collabRequests, isLoading,
      login, logout, updateProfile, postJob, sendMessage, sendCollabRequest, updateCollabStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};