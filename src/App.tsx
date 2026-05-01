import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ElectionTimeline } from './components/ElectionTimeline';
import { ChatBot } from './components/ChatBot';
import { ResourceHub } from './components/ResourceHub';
import { CivicLookup } from './components/CivicLookup';
import { Activity } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary/30">
      <div className="bg-primary/10 border-b border-primary/20 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center justify-center gap-2">
        <Activity size={12} className="animate-pulse" /> Live Election Data Feed Active
      </div>
      
      <Navbar />
      
      <main>
        <Hero />
        
        <section id="lookup" className="bg-slate-950">
          <div className="container">
            <CivicLookup />
          </div>
        </section>

        <section id="roadmap" className="bg-slate-900/30">
          <div className="container">
            <div className="section-header">
              <h2 className="text-4xl font-bold">The Election <span className="gradient-text">Roadmap</span></h2>
              <p>A systematic guide to understanding every phase of the electoral cycle, from initial preparation to final certification.</p>
            </div>
            <ElectionTimeline />
          </div>
        </section>
        
        <section id="resources" className="bg-slate-950">
          <div className="container">
            <div className="section-header">
              <h2 className="text-4xl font-bold">Voter <span className="gradient-text">Toolbox</span></h2>
              <p>Essential educational materials and official resources to help you prepare for upcoming elections.</p>
            </div>
            <ResourceHub />
          </div>
        </section>
      </main>
      
      <ChatBot />
      
      <footer className="bg-slate-900/50 py-12 border-t border-white/5">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="font-bold text-white">VoteWise AI</span>
          </div>
          <p>© 2026 Democracy Education Initiative. Powered by Google Civic Data.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
