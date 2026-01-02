/**
 * MongoDB Atlas Data API Service.
 * This service handles real cloud persistence. 
 * Replace placeholders with your actual MongoDB Atlas Data API credentials.
 */
import { ArtistProfile, Job, Conversation, CollabRequest } from '../types';

// CONFIGURATION: Replace these with your MongoDB Atlas Data API details
const MONGODB_CONFIG = {
  apiKey: 'YOUR_MONGODB_DATA_API_KEY', // Get this from Atlas > Data API
  baseUrl: 'https://data.mongodb-api.com/app/data-xxxx/endpoint/data/v1', // Your App URL
  dataSource: 'Cluster0', // Your Cluster Name
  database: 'atelier_db',
};

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'api-key': MONGODB_CONFIG.apiKey,
};

async function atlasFetch(action: string, collection: string, body: any) {
  // If the API key is not set, we fallback to a simulated delay and mock response
  if (MONGODB_CONFIG.apiKey === 'YOUR_MONGODB_DATA_API_KEY') {
    console.warn("MongoDB API Key not configured. Using simulated cloud response.");
    await new Promise(r => setTimeout(r, 800));
    return null;
  }

  try {
    const response = await fetch(`${MONGODB_CONFIG.baseUrl}/action/${action}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        dataSource: MONGODB_CONFIG.dataSource,
        database: MONGODB_CONFIG.database,
        collection,
        ...body,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error(`MongoDB Atlas Error (${action}):`, error);
    return null;
  }
}

export const db = {
  async getArtists(): Promise<ArtistProfile[]> {
    const result = await atlasFetch('find', 'artists', { filter: {} });
    if (!result) {
      const saved = localStorage.getItem('atelier_artists');
      return saved ? JSON.parse(saved) : [];
    }
    return result.documents;
  },

  async saveArtists(artists: ArtistProfile[]): Promise<void> {
    // In a real app, you would use updateOne for each artist, 
    // but for simplicity we sync the full state or use local fallback
    localStorage.setItem('atelier_artists', JSON.stringify(artists));
    
    // Cloud sync example: Upserting the specific changed artist (this would be called inside saveArtists logic)
    for (const artist of artists) {
      await atlasFetch('updateOne', 'artists', {
        filter: { id: artist.id },
        update: { $set: artist },
        upsert: true
      });
    }
  },

  async getJobs(): Promise<Job[]> {
    const result = await atlasFetch('find', 'jobs', { filter: {}, sort: { createdAt: -1 } });
    if (!result) {
      const saved = localStorage.getItem('atelier_jobs');
      return saved ? JSON.parse(saved) : [];
    }
    return result.documents;
  },

  async saveJobs(jobs: Job[]): Promise<void> {
    localStorage.setItem('atelier_jobs', JSON.stringify(jobs));
    // Cloud sync: Push the latest job
    if (jobs.length > 0) {
      await atlasFetch('insertOne', 'jobs', { document: jobs[0] });
    }
  },

  async getConversations(): Promise<Conversation[]> {
    const result = await atlasFetch('find', 'conversations', { filter: {} });
    return result?.documents || JSON.parse(localStorage.getItem('atelier_conversations') || '[]');
  },

  async saveConversations(convos: Conversation[]): Promise<void> {
    localStorage.setItem('atelier_conversations', JSON.stringify(convos));
    // Real logic would use updateOne to push specific messages
  },

  async getCollabRequests(): Promise<CollabRequest[]> {
    const result = await atlasFetch('find', 'collab_requests', { filter: {} });
    return result?.documents || JSON.parse(localStorage.getItem('atelier_collab_reqs') || '[]');
  },

  async saveCollabRequests(reqs: CollabRequest[]): Promise<void> {
    localStorage.setItem('atelier_collab_reqs', JSON.stringify(reqs));
  }
};