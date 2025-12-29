/**
 * Artist discovery page. 
 * Provides a searchable and filterable grid of artist profiles. 
 * Allows users to find creative talent by medium, availability status, and name.
 */
import React, { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
/* Updated import to react-router to resolve missing exported member errors */
import { Link, useSearchParams } from 'react-router';
import { Filter, Search, MapPin, Briefcase, Star, X } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { artists } = useStore();
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [selectedMedium, setSelectedMedium] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');

  const mediums = ['All', 'Photography', 'Illustration', 'Digital Art', 'Motion Design', 'Traditional Art', 'Music', 'Videography'];
  const availabilities = ['All', 'Available', 'Busy', 'Booked'];

  const filteredArtists = useMemo(() => {
    return artists.filter(artist => {
      const matchesQuery = !searchQuery || 
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.mediums.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesMedium = selectedMedium === 'All' || artist.mediums.includes(selectedMedium);
      const matchesAvailability = selectedAvailability === 'All' || artist.availabilityStatus === selectedAvailability;

      return matchesQuery && matchesMedium && matchesAvailability;
    });
  }, [artists, searchQuery, selectedMedium, selectedAvailability]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMedium('All');
    setSelectedAvailability('All');
  };

  return (
    <div className="space-y-12 py-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Explore Artists</h1>
        <p className="text-[#717171] text-lg">Connect with talented creators across multiple disciplines.</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1a1]" size={18} />
            <input 
              type="text" 
              placeholder="Search artists..." 
              className="pl-10 pr-4 py-2 bg-white border border-[#e0e0e0] rounded-xl outline-none focus:border-black transition-all w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#717171]">Medium:</span>
            <select 
              className="px-4 py-2 bg-white border border-[#e0e0e0] rounded-xl outline-none text-sm cursor-pointer hover:border-black"
              value={selectedMedium}
              onChange={(e) => setSelectedMedium(e.target.value)}
            >
              {mediums.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#717171]">Status:</span>
            <select 
              className="px-4 py-2 bg-white border border-[#e0e0e0] rounded-xl outline-none text-sm cursor-pointer hover:border-black"
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
            >
              {availabilities.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {(searchQuery || selectedMedium !== 'All' || selectedAvailability !== 'All') && (
            <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 font-medium">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {filteredArtists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredArtists.map(artist => (
            <Link key={artist.id} to={`/profile/${artist.id}`} className="group bg-white rounded-2xl overflow-hidden border border-[#e0e0e0] hover:shadow-lg transition-all flex flex-col">
              <div className="h-32 overflow-hidden">
                <img src={artist.banner} alt={artist.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6 relative -mt-10 flex-1 flex flex-col">
                <img src={artist.avatar} alt={artist.name} className="w-16 h-16 rounded-full border-4 border-white object-cover mb-4" />
                <div className="flex items-center gap-1 mb-1">
                  <h3 className="text-lg font-bold group-hover:underline">{artist.name}</h3>
                  {artist.isFeatured && <Star size={12} className="fill-yellow-400 text-yellow-400" />}
                </div>
                <p className="text-[#717171] text-xs font-medium mb-4 line-clamp-1">{artist.headline}</p>
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex items-center text-[#a1a1a1] text-[10px] gap-2 uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {artist.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {artist.mediums.map(m => (
                      <span key={m} className="px-2 py-0.5 bg-[#f8f8f8] text-[9px] font-bold uppercase text-[#a1a1a1] border border-[#f0f0f0] rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <div className="bg-[#f0f0f0] w-16 h-16 rounded-full flex items-center justify-center mx-auto text-[#a1a1a1]">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold">No artists found</h3>
          <p className="text-[#717171]">Try adjusting your search or filters to find more creators.</p>
        </div>
      )}
    </div>
  );
};