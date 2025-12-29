/**
 * Landing page component. 
 * Features a high-impact hero section, a showcase of featured artists, recent job board highlights, 
 * and an overview of the platform's key value propositions.
 */
import React from 'react';
import { useStore } from '../StoreContext';
/* Updated import to react-router to resolve missing exported member errors */
import { Link } from 'react-router';
// Added MessageSquare to imports
import { ArrowRight, Star, MapPin, Briefcase, MessageSquare } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { artists, jobs, user } = useStore();
  const featuredArtists = artists.filter(a => a.isFeatured);
  const recentJobs = jobs.slice(0, 3);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
          Where creativity meets <span className="text-[#a1a1a1]">opportunity.</span>
        </h1>
        <p className="text-lg md:text-xl text-[#717171] max-w-2xl mx-auto font-light">
          Atelier is the premier networking platform for professional artists to showcase portfolios, find projects, and collaborate.
        </p>
        {!user && (
          <div className="flex items-center justify-center gap-4 pt-6">
            <Link to="/auth" className="bg-black text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-[#1a1a1a] transition-all flex items-center gap-2">
              Join Atelier <ArrowRight size={20} />
            </Link>
            <Link to="/explore" className="bg-white border border-[#e0e0e0] px-8 py-3.5 rounded-full font-bold text-lg hover:border-black transition-all">
              Browse Artists
            </Link>
          </div>
        )}
      </section>

      {/* Featured Artists */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Featured Artists</h2>
            <p className="text-[#717171]">Handpicked talent from our growing creative community.</p>
          </div>
          <Link to="/explore" className="text-black font-semibold flex items-center gap-1 hover:underline underline-offset-4">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtists.map(artist => (
            <Link key={artist.id} to={`/profile/${artist.id}`} className="group bg-white rounded-2xl overflow-hidden border border-[#e0e0e0] hover:shadow-xl transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img src={artist.banner} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 relative -mt-12">
                <img src={artist.avatar} alt={artist.name} className="w-20 h-20 rounded-full border-4 border-white object-cover mb-4" />
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold">{artist.name}</h3>
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-[#717171] text-sm font-medium mb-3">{artist.headline}</p>
                <div className="flex items-center text-[#a1a1a1] text-xs gap-3 mb-4">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {artist.location}</span>
                  <span className="flex items-center gap-1"><Briefcase size={12} /> {artist.availabilityStatus}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {artist.mediums.slice(0, 2).map(m => (
                    <span key={m} className="px-3 py-1 bg-[#f0f0f0] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#717171]">{m}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Job Postings */}
      <section className="space-y-8 bg-black text-white p-12 md:p-16 rounded-[2rem]">
        <div className="flex items-end justify-between border-b border-white/10 pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Recent Opportunities</h2>
            <p className="text-white/60">The latest commissions, freelance, and full-time roles.</p>
          </div>
          <Link to="/jobs" className="text-white font-semibold flex items-center gap-1 hover:underline underline-offset-4">
            View Job Board <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {recentJobs.map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl hover:bg-white/5 transition-colors group">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{job.category}</span>
                <h3 className="text-xl font-medium group-hover:text-white transition-colors">{job.title}</h3>
                <p className="text-white/40 text-sm">{job.company} • {job.budget}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <div className="hidden lg:flex gap-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-full border border-white/10 text-xs text-white/60">{skill}</span>
                  ))}
                </div>
                <div className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm">Apply</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-[#f0f0f0] rounded-2xl flex items-center justify-center text-black">
            <Star size={24} />
          </div>
          <h3 className="text-xl font-bold">Showcase Your Work</h3>
          <p className="text-[#717171] leading-relaxed">High-fidelity portfolio pages designed to let your art take center stage without visual clutter.</p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-[#f0f0f0] rounded-2xl flex items-center justify-center text-black">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-xl font-bold">Direct Messaging</h3>
          <p className="text-[#717171] leading-relaxed">Communicate directly with clients and other artists to negotiate terms and share feedback.</p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-[#f0f0f0] rounded-2xl flex items-center justify-center text-black">
            <Briefcase size={24} />
          </div>
          <h3 className="text-xl font-bold">Secure Commissions</h3>
          <p className="text-[#717171] leading-relaxed">Discover gigs and opportunities specifically tailored for creative skillsets and artistic mediums.</p>
        </div>
      </section>
    </div>
  );
};