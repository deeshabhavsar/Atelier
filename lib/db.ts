/**
 * Mock database service. 
 * Simulates a cloud database using localStorage for persistence. 
 * Implements asynchronous methods to mimic real-world API latency and structure.
 */
import { ArtistProfile, Job, Conversation, CollabRequest } from '../types';
import { INITIAL_ARTISTS, INITIAL_JOBS } from '../mockData';

// This service mimics the MongoDB Atlas Data API structure.
// In a real production app, you would replace these fetch calls with your Atlas Data API endpoint.
export const db = {
  async getArtists(): Promise<ArtistProfile[]> {
    // Simulate API Latency
    await new Promise(r => setTimeout(r, 800));
    const saved = localStorage.getItem('atelier_artists');
    return saved ? JSON.parse(saved) : INITIAL_ARTISTS;
  },

  async saveArtists(artists: ArtistProfile[]): Promise<void> {
    localStorage.setItem('atelier_artists', JSON.stringify(artists));
  },

  async getJobs(): Promise<Job[]> {
    await new Promise(r => setTimeout(r, 600));
    const saved = localStorage.getItem('atelier_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  },

  async saveJobs(jobs: Job[]): Promise<void> {
    localStorage.setItem('atelier_jobs', JSON.stringify(jobs));
  },

  async getConversations(): Promise<Conversation[]> {
    const saved = localStorage.getItem('atelier_conversations');
    return saved ? JSON.parse(saved) : [];
  },

  async saveConversations(convos: Conversation[]): Promise<void> {
    localStorage.setItem('atelier_conversations', JSON.stringify(convos));
  },

  async getCollabRequests(): Promise<CollabRequest[]> {
    const saved = localStorage.getItem('atelier_collab_reqs');
    return saved ? JSON.parse(saved) : [];
  },

  async saveCollabRequests(reqs: CollabRequest[]): Promise<void> {
    localStorage.setItem('atelier_collab_reqs', JSON.stringify(reqs));
  }
};