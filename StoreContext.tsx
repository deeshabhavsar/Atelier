/**
 * Global state management. 
 * Updated to support real-time data syncing between MongoDB Atlas and local state.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, ArtistProfile, Job, Conversation, CollabRequest, UserType } from './types';
import { db } from './lib/db';
import { INITIAL_ARTISTS, INITIAL_JOBS } from './mockData';

interface StoreContextType {
  user: UserSession | null;
  artists: ArtistProfile[];
  jobs: Job[];
  conversations: Conversation[];
  collabRequests: CollabRequest[];
  isLoading: boolean;
  login: (email: string, type: UserType) => Promise<void>;
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

  // Initial Sync from Cloud Database
  useEffect(() => {
    const syncWithCloud = async () => {
      setIsLoading(true);
      try {
        const [cloudArtists, cloudJobs, cloudConvos, cloudReqs] = await Promise.all([
          db.getArtists(),
          db.getJobs(),
          db.getConversations(),
          db.getCollabRequests()
        ]);

        // Merge initial mock data if cloud is empty
        setArtists(cloudArtists.length > 0 ? cloudArtists : INITIAL_ARTISTS);
        setJobs(cloudJobs.length > 0 ? cloudJobs : INITIAL_JOBS);
        setConversations(cloudConvos);
        setCollabRequests(cloudReqs);
      } catch (err) {
        console.error("Critical Cloud Sync Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    syncWithCloud();
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('atelier_user', JSON.stringify(user));
    else localStorage.removeItem('atelier_user');
  }, [user]);

  const login = async (email: string, type: UserType) => {
    setIsLoading(true);
    const id = `u_${btoa(email).substring(0, 10)}`; // Deterministic ID based on email
    const name = email.split('@')[0];
    
    let userProfile = artists.find(a => a.id === id);

    if (!userProfile && type === 'artist') {
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
      await db.saveArtists(updatedArtists);
      userProfile = newProfile;
    }

    const newUser: UserSession = { id, name, email, type, profileId: userProfile?.id };
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('atelier_user');
  };

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