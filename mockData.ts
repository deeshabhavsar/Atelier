/**
 * Seed data for development and demonstration.
 * Provides a set of initial artist profiles and job postings to populate the UI.
 */
import { ArtistProfile, Job, Conversation } from './types';

export const INITIAL_ARTISTS: ArtistProfile[] = [
  {
    id: 'a1',
    name: 'Elena Vance',
    headline: 'Fine Art Photographer & Visual Storyteller',
    location: 'Berlin, Germany',
    bio: 'Capturing the intersection of urban decay and natural resilience. Over 10 years of experience in editorial and fine art photography.',
    avatar: 'https://picsum.photos/seed/elena/400/400',
    banner: 'https://picsum.photos/seed/elena-banner/1200/400',
    skills: ['Color Grading', 'Portraiture', 'Film Photography'],
    mediums: ['Photography', 'Digital Manipulation'],
    portfolio: [
      { id: 'p1', title: 'Concrete Garden', description: 'A study on plants growing in abandoned factories.', type: 'image', url: 'https://picsum.photos/seed/p1/800/600', medium: 'Photography', year: '2023', tags: ['Nature', 'Urban'] },
      { id: 'p2', title: 'Blue Hour', description: 'Evening shadows in Kreuzberg.', type: 'image', url: 'https://picsum.photos/seed/p2/800/600', medium: 'Photography', year: '2024', tags: ['Architecture'] },
    ],
    experience: [
      { id: 'e1', title: 'Senior Photographer', company: 'Vogue Berlin', period: '2020 - Present', description: 'Leading fashion shoots and creative direction.' }
    ],
    isFeatured: true,
    isAvailable: true,
    availabilityStatus: 'Available',
    pricing: { min: 500, max: 2000, unit: 'project' },
    collabPreferences: { isOpen: true, types: ['Co-creation'], style: 'hybrid' }
  },
  {
    id: 'a2',
    name: 'Marcus Kaine',
    headline: '3D Motion Designer & NFT Artist',
    location: 'Tokyo, Japan',
    bio: 'Exploring digital surrealism through procedural generation and fluid simulations.',
    avatar: 'https://picsum.photos/seed/marcus/400/400',
    banner: 'https://picsum.photos/seed/marcus-banner/1200/400',
    skills: ['Cinema 4D', 'Octane Render', 'Houdini'],
    mediums: ['Digital Art', 'Motion Design'],
    portfolio: [
      { id: 'p3', title: 'Fluidity', description: 'Abstract simulation of metallic liquids.', type: 'image', url: 'https://picsum.photos/seed/p3/800/600', medium: 'Digital Art', year: '2023', tags: ['Abstract', '3D'] }
    ],
    experience: [],
    isFeatured: true,
    isAvailable: false,
    availabilityStatus: 'Booked',
    pricing: { min: 100, max: 250, unit: 'hour' },
    collabPreferences: { isOpen: false, types: [], style: 'remote' }
  },
  {
    id: 'a3',
    name: 'Sofia Rossi',
    headline: 'Illustrator & Character Designer',
    location: 'Milan, Italy',
    bio: 'Whimsical character designs inspired by folklore and traditional children\'s book illustrations.',
    avatar: 'https://picsum.photos/seed/sofia/400/400',
    banner: 'https://picsum.photos/seed/sofia-banner/1200/400',
    skills: ['Watercolour', 'Procreate', 'Character Design'],
    mediums: ['Illustration', 'Traditional Art'],
    portfolio: [],
    experience: [],
    isFeatured: false,
    isAvailable: true,
    availabilityStatus: 'Available',
    pricing: { min: 200, max: 800, unit: 'project' },
    collabPreferences: { isOpen: true, types: ['Commissions'], style: 'remote' }
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Brand Identity Illustrator',
    company: 'Nexus Creative',
    category: 'freelance',
    description: 'We need a series of 10 illustrations for a new sustainability startup branding project.',
    budget: '$2,000 - $3,500',
    skills: ['Vector Illustration', 'Branding'],
    deadline: '2024-06-30',
    postedBy: 'c1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'j2',
    title: 'Short Film Music Composer',
    company: 'Independent Production',
    category: 'commission',
    description: 'Seeking an atmospheric soundtrack for a 15-minute psychological thriller.',
    budget: '$1,500',
    skills: ['Music Production', 'Sound Design'],
    deadline: '2024-07-15',
    postedBy: 'c2',
    createdAt: new Date().toISOString()
  }
];