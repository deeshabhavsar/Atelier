/**
 * Global layout wrapper.
 * Provides the consistent header (navigation, search), mobile menu, and footer across all pages.
 * Displays a visual indicator of the database connection status.
 */
import React, { useState } from 'react';
/* Updated import to react-router to resolve missing exported member errors */
import { Link, useNavigate, useLocation } from 'react-router';
import { useStore } from '../StoreContext';
import { Search, User, LogOut, MessageSquare, Briefcase, Compass, Home, Menu, X, Cloud, CloudOff, Loader2 } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isLoading } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#e0e0e0] px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter text-black flex items-center gap-2">
            ATELIER
            {isLoading ? (
              <Loader2 size={12} className="animate-spin text-[#a1a1a1]" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Database Connected" />
            )}
          </Link>
          
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-[#f0f0f0] rounded-full px-4 py-1.5 w-64 lg:w-96">
            <Search size={16} className="text-[#a1a1a1] mr-2" />
            <input 
              type="text" 
              placeholder="Search artists, mediums, jobs..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#a1a1a1]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`flex items-center gap-1.5 text-sm font-medium ${isActive('/') ? 'text-black' : 'text-[#717171] hover:text-black'}`}>
            <Home size={18} /> Home
          </Link>
          <Link to="/explore" className={`flex items-center gap-1.5 text-sm font-medium ${isActive('/explore') ? 'text-black' : 'text-[#717171] hover:text-black'}`}>
            <Compass size={18} /> Explore
          </Link>
          <Link to="/jobs" className={`flex items-center gap-1.5 text-sm font-medium ${isActive('/jobs') ? 'text-black' : 'text-[#717171] hover:text-black'}`}>
            <Briefcase size={18} /> Jobs
          </Link>
          <Link to="/messages" className={`flex items-center gap-1.5 text-sm font-medium ${isActive('/messages') ? 'text-black' : 'text-[#717171] hover:text-black'}`}>
            <MessageSquare size={18} /> Messages
          </Link>
          
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-[#f0f0f0]">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden lg:block">
                  <p className="text-[10px] font-bold text-black uppercase">{user.name}</p>
                  <p className="text-[9px] text-[#a1a1a1] uppercase flex items-center gap-1 justify-end">
                    <Cloud size={10} /> Online
                  </p>
                </div>
                <Link to={`/profile/${user.profileId || user.id}`} className="w-8 h-8 rounded-full overflow-hidden border border-[#e0e0e0]">
                  <img src={`https://picsum.photos/seed/${user.id}/32/32`} alt="Profile" className="w-full h-full object-cover" />
                </Link>
                <button onClick={logout} className="text-[#717171] hover:text-black transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-sm font-bold bg-black text-white px-5 py-2 rounded-full hover:bg-[#1a1a1a] transition-all">
                Sign In
              </Link>
            )}
          </div>
        </div>

        <button className="md:hidden text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-6 flex flex-col gap-6">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium border-b border-[#f0f0f0] pb-4">Home</Link>
          <Link to="/explore" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium border-b border-[#f0f0f0] pb-4">Explore Artists</Link>
          <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium border-b border-[#f0f0f0] pb-4">Job Board</Link>
          <Link to="/messages" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium border-b border-[#f0f0f0] pb-4">Messages</Link>
          {user ? (
            <div className="flex flex-col gap-4 mt-4">
               <Link to={`/profile/${user.id}`} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                <User size={20} /> My Profile
              </Link>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-red-500">
                <LogOut size={20} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="bg-black text-white text-center py-4 rounded-xl font-bold">Sign In</Link>
          )}
        </div>
      )}

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
             <Loader2 size={48} className="animate-spin text-black" />
             <p className="text-[#a1a1a1] text-sm animate-pulse">Establishing secure connection...</p>
          </div>
        ) : children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e0e0e0] py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-bold text-lg mb-4 tracking-tighter">ATELIER</h3>
            <p className="text-[#717171] text-sm leading-relaxed">
              The professional network designed exclusively for the creative community.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Platform</h4>
            <div className="flex flex-col gap-2 text-[#717171] text-sm">
              <Link to="/explore" className="hover:text-black">Explore Artists</Link>
              <Link to="/jobs" className="hover:text-black">Job Board</Link>
              <Link to="/featured" className="hover:text-black">Featured Talent</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">For Artists</h4>
            <div className="flex flex-col gap-2 text-[#717171] text-sm">
              <Link to="/profile" className="hover:text-black">Create Portfolio</Link>
              <Link to="/collab" className="hover:text-black">Find Collaborators</Link>
              <Link to="/growth" className="hover:text-black">Career Path</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Support</h4>
            <div className="flex flex-col gap-2 text-[#717171] text-sm">
              <Link to="/help" className="hover:text-black">Help Center</Link>
              <Link to="/terms" className="hover:text-black">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-black">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#f0f0f0] text-[#a1a1a1] text-xs flex flex-col md:flex-row justify-between gap-4">
          <p>© 2024 Atelier Creative Network. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Twitter</span>
            <span>Instagram</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </footer>
    </div>
  );
};