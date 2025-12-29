/**
 * Artist profile view. 
 * Renders an artist's banner, bio, experience, skills, and portfolio grid. 
 * Includes interactive features like the portfolio lightbox and collaboration request system.
 */
import React, { useState } from 'react';
/* Updated import to react-router to resolve missing exported member errors */
import { useParams, Link } from 'react-router';
import { useStore } from '../StoreContext';
import { MapPin, Calendar, Mail, Share2, Star, Briefcase, Plus, ExternalLink, X, ArrowUpRight } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const { artists, user, sendCollabRequest } = useStore();
  const artist = artists.find(a => a.id === id);
  const isOwnProfile = user?.profileId === id;

  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<any>(null);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [collabMessage, setCollabMessage] = useState('');

  if (!artist) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Profile not found</h2>
        <Link to="/explore" className="text-blue-500 hover:underline">Go back to explore</Link>
      </div>
    );
  }

  const handleSendCollab = () => {
    if (!user) return alert('Please sign in to send requests.');
    sendCollabRequest({ fromId: user.id, toId: artist.id, message: collabMessage });
    setShowCollabModal(false);
    setCollabMessage('');
    alert('Collaboration request sent!');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12">
      {/* Header / Banner */}
      <div className="relative rounded-[2rem] overflow-hidden bg-white border border-[#e0e0e0]">
        <div className="h-64 md:h-80 relative">
          <img src={artist.banner} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="p-8 md:p-12 relative flex flex-col md:flex-row md:items-end gap-8">
          <div className="relative -mt-32 md:-mt-40">
            <img src={artist.avatar} alt={artist.name} className="w-32 h-32 md:w-48 md:h-48 rounded-full border-[6px] border-white object-cover shadow-2xl" />
            {artist.isAvailable && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white md:text-black">{artist.name}</h1>
                  {artist.isFeatured && <Star size={20} className="fill-yellow-400 text-yellow-400" />}
                </div>
                <p className="text-lg md:text-xl font-medium text-white/90 md:text-[#717171]">{artist.headline}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {isOwnProfile ? (
                  <button className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#1a1a1a] transition-all">Edit Profile</button>
                ) : (
                  <>
                    <Link to={`/messages?user=${artist.id}`} className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#1a1a1a] transition-all flex items-center gap-2">
                      <Mail size={16} /> Send Message
                    </Link>
                    {artist.collabPreferences.isOpen && (
                      <button onClick={() => setShowCollabModal(true)} className="bg-white border border-[#e0e0e0] px-6 py-2.5 rounded-full font-bold text-sm hover:border-black transition-all">Collab</button>
                    )}
                  </>
                )}
                <button className="p-2.5 border border-[#e0e0e0] rounded-full hover:bg-gray-50"><Share2 size={18} /></button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-white/70 md:text-[#a1a1a1]">
              <span className="flex items-center gap-1.5"><MapPin size={16} /> {artist.location}</span>
              <span className="flex items-center gap-1.5"><Briefcase size={16} /> {artist.availabilityStatus}</span>
              <span className="flex items-center gap-1.5 text-black bg-[#f0f0f0] px-3 py-1 rounded-full text-xs">
                ${artist.pricing.min} - ${artist.pricing.max} / {artist.pricing.unit}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-[#e0e0e0] pb-2">About</h2>
            <p className="text-[#717171] leading-relaxed whitespace-pre-line">{artist.bio}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-[#e0e0e0] pb-2">Skills & Mediums</h2>
            <div className="flex flex-wrap gap-2">
              {artist.mediums.map(m => (
                <span key={m} className="px-4 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{m}</span>
              ))}
              {artist.skills.map(s => (
                <span key={s} className="px-4 py-1.5 bg-[#f0f0f0] text-[#717171] text-[10px] font-bold uppercase tracking-widest rounded-full">{s}</span>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
              <h2 className="text-xl font-bold tracking-tight">Experience</h2>
              {isOwnProfile && <Plus size={18} className="cursor-pointer" />}
            </div>
            <div className="space-y-6">
              {artist.experience.map(exp => (
                <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-[#e0e0e0]">
                  <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-black border-2 border-white" />
                  <h4 className="font-bold text-sm">{exp.title}</h4>
                  <p className="text-xs text-[#717171] font-medium">{exp.company} • {exp.period}</p>
                  <p className="text-sm mt-2 text-[#717171] leading-relaxed">{exp.description}</p>
                </div>
              ))}
              {artist.experience.length === 0 && <p className="text-sm text-[#a1a1a1] italic">No experience added yet.</p>}
            </div>
          </section>
        </div>

        {/* Portfolio Main */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-4">
            <h2 className="text-2xl font-bold tracking-tight">Portfolio</h2>
            {isOwnProfile && <button className="text-sm font-bold flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f0f0f0] hover:bg-[#e0e0e0] transition-colors"><Plus size={16} /> Add Work</button>}
          </div>

          {artist.portfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artist.portfolio.map(item => (
                <div 
                  key={item.id} 
                  className="group relative cursor-pointer rounded-2xl overflow-hidden aspect-square bg-[#f0f0f0] border border-[#e0e0e0]"
                  onClick={() => setSelectedPortfolioItem(item)}
                >
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                    <p className="text-white/80 text-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.medium}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#f8f8f8] border-2 border-dashed border-[#e0e0e0] rounded-[2rem] p-12 text-center space-y-4">
              <p className="text-[#a1a1a1]">This artist hasn't shared any portfolio pieces yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Lightbox */}
      {selectedPortfolioItem && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold">{selectedPortfolioItem.title}</h2>
              <p className="text-sm text-[#717171]">{selectedPortfolioItem.medium} • {selectedPortfolioItem.year}</p>
            </div>
            <button onClick={() => setSelectedPortfolioItem(null)} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-[#f8f8f8] p-8 flex items-center justify-center">
             <img src={selectedPortfolioItem.url} alt={selectedPortfolioItem.title} className="max-w-full max-h-full object-contain shadow-2xl" />
          </div>
          <div className="p-8 max-w-4xl mx-auto w-full space-y-6">
            <p className="text-lg text-[#1a1a1a] leading-relaxed">{selectedPortfolioItem.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedPortfolioItem.tags.map((t: string) => <span key={t} className="px-3 py-1 bg-[#f0f0f0] rounded-full text-xs font-medium text-[#717171]">#{t}</span>)}
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Modal */}
      {showCollabModal && (
        <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Send Collaboration Request</h2>
              <button onClick={() => setShowCollabModal(false)}><X size={20} /></button>
            </div>
            <p className="text-[#717171]">Interested in working with {artist.name}? Send a proposal message describing your project and why you'd like to collaborate.</p>
            <textarea 
              className="w-full h-40 p-4 bg-[#f8f8f8] border border-[#e0e0e0] rounded-2xl outline-none focus:border-black transition-all resize-none"
              placeholder="Tell them about your project idea..."
              value={collabMessage}
              onChange={(e) => setCollabMessage(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={handleSendCollab} className="flex-1 bg-black text-white py-3.5 rounded-full font-bold hover:bg-[#1a1a1a]">Send Request</button>
              <button onClick={() => setShowCollabModal(false)} className="px-8 border border-[#e0e0e0] rounded-full font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};