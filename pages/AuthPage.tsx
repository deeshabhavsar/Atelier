/**
 * Authentication page. 
 * Handles user sign-in and sign-up flows. 
 * Allows users to choose between 'artist' or 'client' account types during registration.
 */
import React, { useState } from 'react';
import { useStore } from '../StoreContext';
/* Updated import to react-router to resolve missing exported member errors */
import { useNavigate } from 'react-router';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login } = useStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'artist' | 'client'>('artist');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, userType);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto py-12 md:py-24 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">ATELIER</h1>
        <p className="text-[#717171] text-lg font-medium">
          {isLogin ? 'Welcome back.' : 'Join the creative network.'}
        </p>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-[#e0e0e0] shadow-sm space-y-8">
        {!isLogin && (
          <div className="flex items-center p-1 bg-[#f0f0f0] rounded-xl">
            <button 
              onClick={() => setUserType('artist')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${userType === 'artist' ? 'bg-white shadow-sm' : 'text-[#a1a1a1]'}`}
            >
              I'm an Artist
            </button>
            <button 
              onClick={() => setUserType('client')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${userType === 'client' ? 'bg-white shadow-sm' : 'text-[#a1a1a1]'}`}
            >
              I'm a Client
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#717171] uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1a1]" size={16} />
              <input 
                required
                type="email" 
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl outline-none focus:border-black transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#717171] uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1a1]" size={16} />
              <input 
                required
                type="password" 
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl outline-none focus:border-black transition-all"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-2">
            {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-[#717171] hover:text-black"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>

      <div className="text-center text-[#a1a1a1] text-xs font-medium space-y-4">
        <p>By continuing, you agree to Atelier's Terms of Service and Privacy Policy.</p>
        <div className="flex justify-center gap-6 pt-4 border-t border-[#f0f0f0]">
          <span className="hover:text-black cursor-pointer">Security</span>
          <span className="hover:text-black cursor-pointer">Compliance</span>
          <span className="hover:text-black cursor-pointer">Help</span>
        </div>
      </div>
    </div>
  );
};