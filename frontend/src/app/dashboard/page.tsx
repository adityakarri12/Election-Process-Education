'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { ElectionDashboard } from '@/components/features/ElectionDashboard';
import { Footer } from '@/components/layout/Footer';
import { Activity, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <main className="pt-40 pb-24">
        {/* HEADER */}
        <div className="container mx-auto px-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary mb-8"
          >
            <Activity size={14} className="animate-pulse" /> Live Election Intelligence
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/5">
            <div className="max-w-3xl">
              <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">
                The Democratic <br />
                <span className="text-gradient">Pulse.</span>
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed">
                Explore high-fidelity visualizations of democratic participation. From turnout trends to demographic shifts, witness the evolving landscape of modern elections.
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-3xl">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                <ShieldCheck size={24} />
              </div>
              <div className="pr-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Data Source</p>
                <p className="text-sm font-bold text-white">ECI Stats Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT */}
        <section className="container mx-auto px-6">
          <ElectionDashboard />
        </section>
      </main>

      <Footer />
    </div>
  );
}
