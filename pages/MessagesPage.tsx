/**
 * Messaging interface. 
 * Enables real-time-like text communication between users. 
 * Includes a conversation list, message history, and status indicators.
 */
import React, { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
/* Updated import to react-router to resolve missing exported member errors */
import { useSearchParams } from 'react-router';
// Added MessageSquare to imports
import { Send, Image as ImageIcon, Search, MoreVertical, Paperclip, MessageSquare } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user, conversations, sendMessage, artists } = useStore();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('user');

  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  // Auto-select conversation or create mock one if coming from profile
  useEffect(() => {
    if (initialUserId && user) {
      const existing = conversations.find(c => c.participants.includes(initialUserId) && c.participants.includes(user.id));
      if (existing) {
        setActiveConvoId(existing.id);
      } else {
        // In a real app, we'd create a convo here. For mock, let's just show an empty UI if none exists.
      }
    } else if (conversations.length > 0 && !activeConvoId) {
      setActiveConvoId(conversations[0].id);
    }
  }, [initialUserId, conversations, user]);

  const activeConvo = conversations.find(c => c.id === activeConvoId);
  const otherParticipantId = activeConvo?.participants.find(p => p !== user?.id);
  const otherParticipant = artists.find(a => a.id === otherParticipantId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeConvoId && messageText.trim()) {
      sendMessage(activeConvoId, messageText);
      setMessageText('');
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Please sign in to view messages.</h2>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white border border-[#e0e0e0] rounded-3xl overflow-hidden shadow-sm">
      {/* Sidebar */}
      <div className="w-80 border-r border-[#e0e0e0] flex flex-col">
        <div className="p-6 border-b border-[#e0e0e0]">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1a1]" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-9 pr-4 py-2 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl text-sm outline-none focus:border-black"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map(convo => {
              const otherId = convo.participants.find(p => p !== user.id);
              const otherArtist = artists.find(a => a.id === otherId);
              const lastMsg = convo.messages[convo.messages.length - 1];
              
              return (
                <button 
                  key={convo.id}
                  onClick={() => setActiveConvoId(convo.id)}
                  className={`w-full p-4 flex gap-3 hover:bg-[#f8f8f8] transition-colors border-b border-[#f8f8f8] ${activeConvoId === convo.id ? 'bg-[#f8f8f8] border-l-4 border-l-black' : ''}`}
                >
                  <img src={otherArtist?.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-sm truncate">{otherArtist?.name || 'User'}</h4>
                      <span className="text-[10px] text-[#a1a1a1] uppercase font-bold">12:00</span>
                    </div>
                    <p className="text-xs text-[#717171] truncate">{lastMsg?.text || 'No messages yet'}</p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-[#a1a1a1] text-sm italic">
              No conversations yet.
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#fcfcfc]">
        {activeConvo ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#e0e0e0] bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={otherParticipant?.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                <div>
                  <h4 className="font-bold text-sm">{otherParticipant?.name}</h4>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
                </div>
              </div>
              <button className="p-2 text-[#a1a1a1] hover:text-black"><MoreVertical size={20} /></button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
              {activeConvo.messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.senderId === user.id 
                      ? 'bg-black text-white self-end rounded-br-none' 
                      : 'bg-white border border-[#e0e0e0] text-[#1a1a1a] self-start rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                  <div className={`text-[9px] mt-2 font-bold uppercase tracking-widest ${msg.senderId === user.id ? 'text-white/50' : 'text-[#a1a1a1]'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-[#e0e0e0]">
              <div className="flex items-center gap-4 bg-[#f8f8f8] border border-[#e0e0e0] rounded-2xl px-4 py-2 focus-within:border-black transition-colors">
                <button type="button" className="text-[#a1a1a1] hover:text-black"><Paperclip size={20} /></button>
                <input 
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent py-2 outline-none text-sm"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                />
                <button type="submit" className="bg-black text-white p-2 rounded-xl hover:scale-105 transition-transform">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8">
            <div className="w-16 h-16 bg-[#f0f0f0] rounded-full flex items-center justify-center text-[#a1a1a1]">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold">Select a conversation</h3>
            <p className="text-[#717171] text-center max-w-xs">Pick a chat from the sidebar or reach out to an artist from their profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};