'use client';

import { motion } from 'framer-motion';
import { 
  Shield, Scale, Globe, MessageSquare, 
  Cpu, Mail, Zap
} from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer suppressHydrationWarning className="mt-40 border-t border-white/5 bg-slate-950/50 backdrop-blur-3xl pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">ElectraLearn.</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Advancing democratic literacy through high-fidelity simulations and AI-powered constitutional intelligence.
            </p>
            <div className="flex gap-4">
              {[Globe, Cpu, MessageSquare, Mail].map((Icon, i) => (
                <button key={i} suppressHydrationWarning className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all border border-white/5">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" /> Platform
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Learn', path: '/learn' },
                { name: 'Simulator', path: '/simulation' },
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'AI Chat', path: '/chat' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Resources
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'ECI Portal', url: 'https://eci.gov.in' },
                { name: 'Legal Guidelines', url: 'https://www.eci.gov.in/election-laws' },
                { name: 'Constitution FAQ', url: 'https://legislative.gov.in/constitution-of-india/' },
                { name: 'Voter Stats', url: 'https://www.eci.gov.in/statistical-reports' }
              ].map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-white transition-colors text-left"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-white font-bold mb-4">Stay Informed</h4>
              <p className="text-[11px] text-slate-500 mb-6">Receive bi-weekly updates on electoral reforms and platform features.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="email@example.com"
                  suppressHydrationWarning
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-primary/50 transition-all"
                />
                <button suppressHydrationWarning className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-primary text-white rounded-lg text-[10px] font-bold hover:scale-105 transition-all">
                  Join
                </button>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            © 2026 ElectraLearn Intelligence. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <button key={item} suppressHydrationWarning className="text-[10px] text-slate-600 font-bold uppercase tracking-widest hover:text-slate-400 transition-colors">
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-emerald-500/60 font-black text-[9px] uppercase tracking-tighter">
            <Shield size={12} /> SSL Secured & Encrypted
          </div>
        </div>
      </div>
    </footer>
  );
};
