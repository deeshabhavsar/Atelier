/**
 * Creative job board. 
 * Allows clients to post opportunities and artists to browse and apply for commissions, 
 * freelance projects, or full-time roles.
 */
import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Briefcase, MapPin, DollarSign, Clock, Search, Plus, X } from 'lucide-react';

export const JobBoard: React.FC = () => {
  const { jobs, postJob, user } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPostModal, setShowPostModal] = useState(false);
  /* Added 'deadline' to newJob state to satisfy Omit<Job, 'id' | 'createdAt'> */
  const [newJob, setNewJob] = useState({ title: '', company: '', category: 'freelance' as any, description: '', budget: '', skills: '', deadline: '' });

  const categories = ['All', 'commission', 'freelance', 'full-time', 'collaboration'];

  const filteredJobs = jobs.filter(job => selectedCategory === 'All' || job.category === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please sign in to post.');
    postJob({
      ...newJob,
      skills: newJob.skills.split(',').map(s => s.trim()),
      postedBy: user.id
    });
    setShowPostModal(false);
    setNewJob({ title: '', company: '', category: 'freelance', description: '', budget: '', skills: '', deadline: '' });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Creative Opportunities</h1>
          <p className="text-[#717171] text-lg">Find your next project or hire top artistic talent.</p>
        </div>
        <button 
          onClick={() => setShowPostModal(true)}
          className="bg-black text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#1a1a1a] self-start"
        >
          <Plus size={20} /> Post a Job
        </button>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap ${
              selectedCategory === cat ? 'bg-black text-white border-black' : 'bg-white border-[#e0e0e0] text-[#717171] hover:border-black'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white border border-[#e0e0e0] rounded-2xl p-8 hover:shadow-md transition-shadow group">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1a1a1]">{job.category}</span>
                    <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <p className="text-[#717171] font-medium">{job.company}</p>
                  </div>
                  
                  <p className="text-[#717171] leading-relaxed line-clamp-3">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {job.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-[#f0f0f0] rounded-full text-xs font-medium text-[#717171]">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="md:w-64 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-black">
                      <DollarSign size={16} /> {job.budget}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#a1a1a1] font-medium">
                      <Clock size={16} /> Deadline: {job.deadline}
                    </div>
                  </div>
                  <button className="w-full bg-black text-white py-3 rounded-full font-bold hover:bg-[#1a1a1a] transition-all">Apply Now</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-[#a1a1a1]">
            <p>No jobs found in this category.</p>
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Post New Opportunity</h2>
              <button onClick={() => setShowPostModal(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#717171]">Job Title</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl outline-none focus:border-black"
                    value={newJob.title}
                    onChange={e => setNewJob({...newJob, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#717171]">Company / Client Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full p-3 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl outline-none focus:border-black"
                    value={newJob.company}
                    onChange={e => setNewJob({...newJob, company: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#717171]">Category</label>
                  <select 
                    className="w-full p-3 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl outline-none focus:border-black"
                    value={newJob.category}
                    onChange={e => setNewJob({...newJob, category: e.target.value as any})}
                  >
                    <option value="commission">Commission</option>
                    <option value="freelance">Freelance</option>
                    <option value="full-time">Full-time</option>
                    <option value="collaboration">Collaboration</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#717171]">Budget Range</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. $1,000 - $3,000"
                    className="w-full p-3 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl outline-none focus:border-black"
                    value={newJob.budget}
                    onChange={e => setNewJob({...newJob, budget: e.target.value})}
                  />
                </div>
              </div>

              {/* Added Deadline Field */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#717171]">Deadline</label>
                <input 
                  required 
                  type="date" 
                  className="w-full p-3 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl outline-none focus:border-black"
                  value={newJob.deadline}
                  onChange={e => setNewJob({...newJob, deadline: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#717171]">Required Skills (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Illustration, Branding, UI Design"
                  className="w-full p-3 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl outline-none focus:border-black"
                  value={newJob.skills}
                  onChange={e => setNewJob({...newJob, skills: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#717171]">Description</label>
                <textarea 
                  required 
                  className="w-full h-32 p-3 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl outline-none focus:border-black resize-none"
                  value={newJob.description}
                  onChange={e => setNewJob({...newJob, description: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-[#1a1a1a]">Post Listing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};