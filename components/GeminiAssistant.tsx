/**
 * AI-powered creative assistant component. 
 * Connects to the Google Gemini API to provide artists with professional feedback, 
 * profile optimization tips, and creative career coaching.
 */
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, X, MessageCircle, Send, Loader2 } from 'lucide-react';
import { useStore } from '../StoreContext';

export const GeminiAssistant: React.FC = () => {
  const { user, artists } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const artistProfile = artists.find(a => a.id === user?.profileId);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg = prompt;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setPrompt('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are a professional Creative Career Coach for Atelier, a networking platform for artists. 
      The current user is ${artistProfile?.name || 'an artist'} who works in ${artistProfile?.mediums.join(', ') || 'various mediums'}.
      Their current headline is "${artistProfile?.headline || 'Emerging Artist'}".
      Help them optimize their bio, suggest better headlines, or give professional advice on their portfolio.
      Keep answers concise, professional, and minimalist in tone.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I couldn't generate a response. Please try again." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Connection to Atelier Intelligence failed." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[60] bg-black text-white p-4 rounded-2xl shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-bold pr-2">Atelier Intelligence</span>
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[60] w-96 max-h-[500px] bg-white rounded-3xl shadow-2xl border border-[#e0e0e0] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-black text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <h3 className="text-sm font-bold">Creative Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f8f8]">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs text-[#a1a1a1] font-bold uppercase tracking-widest">Suggested</p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setPrompt("Optimize my artist headline")} className="text-xs p-2 bg-white border border-[#e0e0e0] rounded-xl hover:border-black transition-colors">"Optimize my artist headline"</button>
                  <button onClick={() => setPrompt("How can I improve my bio?")} className="text-xs p-2 bg-white border border-[#e0e0e0] rounded-xl hover:border-black transition-colors">"How can I improve my bio?"</button>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-white border border-[#e0e0e0] text-black rounded-bl-none shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#e0e0e0] p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 size={12} className="animate-spin" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleAskAI} className="p-4 bg-white border-t border-[#e0e0e0] flex gap-2">
            <input 
              type="text" 
              placeholder="Ask for profile advice..."
              className="flex-1 bg-[#f8f8f8] border border-[#e0e0e0] px-3 py-2 rounded-xl text-xs outline-none focus:border-black transition-all"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button type="submit" className="bg-black text-white p-2 rounded-xl">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};