'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShieldAlert, CheckCircle2, XCircle, 
  MapPin, Users, Calendar, Clock,
  ArrowRight, Info, Zap, Globe, Sparkles,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- DATA ---
const MYTHS = [
  { id: 1, myth: "EVMs can be hacked via Bluetooth or Wi-Fi.", reality: "EVMs are standalone machines with no wireless communication capabilities.", isTrue: false },
  { id: 2, myth: "NRI voters can vote online from abroad.", reality: "NRI voters must be physically present at their polling station in India.", isTrue: false },
  { id: 3, myth: "NOTA votes can lead to a re-election if they are the majority.", reality: "NOTA is a symbolic rejection; the candidate with the next highest votes wins.", isTrue: false },
  { id: 4, myth: "Voters can register in multiple constituencies if they own property.", reality: "It is illegal to be registered in more than one constituency.", isTrue: false },
];

// --- COMPONENTS ---

const MythBuster = () => {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const handleAnswer = (answer: boolean) => {
    const isCorrect = answer === MYTHS[index].isTrue;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 10);
    
    setTimeout(() => {
      setFeedback(null);
      if (index < MYTHS.length - 1) setIndex(i => i + 1);
      else setIndex(0);
    }, 1500);
  };

  return (
    <div className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden h-[450px] flex flex-col items-center justify-center text-center">
      <div className="absolute top-0 inset-x-0 h-1 bg-white/5">
        <motion.div 
          className="h-full bg-primary" 
          animate={{ width: `${((index + 1) / MYTHS.length) * 100}%` }} 
        />
      </div>

      <AnimatePresence mode="wait">
        {!feedback ? (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px] font-black uppercase tracking-widest">
              <ShieldAlert size={14} /> Myth vs Reality
            </div>
            <h3 className="text-3xl font-black text-white leading-tight max-w-md">
              "{MYTHS[index].myth}"
            </h3>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => handleAnswer(true)}
                className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
              >
                FACT
              </button>
              <button 
                onClick={() => handleAnswer(false)}
                className="px-8 py-3 bg-red-500 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-red-500/20"
              >
                MYTH
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
              feedback === 'correct' ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
            )}>
              {feedback === 'correct' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
            </div>
            <h4 className="text-2xl font-black text-white">
              {feedback === 'correct' ? 'Intelligence Verified' : 'Standard Misconception'}
            </h4>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              {MYTHS[index].reality}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-10 right-10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">XP Gained: <span className="text-primary">{score}</span></p>
      </div>
    </div>
  );
};

const ConstituencyPulse = () => {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (pincode.length !== 6) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/constituency/${pincode}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-10 h-full">
      <h3 className="text-2xl font-black text-white mb-2 tracking-tighter flex items-center gap-3">
        <MapPin className="text-primary" /> Constituency Pulse
      </h3>
      <p className="text-slate-500 text-xs mb-8">Enter pincode to fetch real-time representative data.</p>

      <div className="relative mb-10">
        <input 
          type="text" 
          maxLength={6}
          placeholder="Enter 6-digit Pincode..."
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-20 text-white focus:border-primary/50 outline-none transition-all"
        />
        <button 
          onClick={search}
          disabled={pincode.length !== 6 || loading}
          className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-xl text-xs font-black disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'PULSE'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {data ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={data.name}
            className="space-y-6"
          >
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{data.state}</p>
              <h4 className="text-2xl font-black text-white">{data.name}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Parliament (MP)</p>
                <p className="text-sm font-bold text-white leading-tight">{data.mp}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Assembly (MLA)</p>
                <p className="text-sm font-bold text-primary leading-tight">{data.mla}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] text-slate-500 font-black uppercase mb-1">District Hub</p>
                <p className="text-sm font-bold text-white leading-tight">{data.district}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Live Turnout</p>
                <p className="text-sm font-bold text-emerald-500 leading-tight">{data.turnout}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-center opacity-30">
            <Globe size={48} className="text-slate-600 mb-4" />
            <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Universal Intelligence Ready</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function IntelligencePage() {
  const [liveIntel, setLiveIntel] = useState<any>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);

  useEffect(() => {
    const fetchLiveIntel = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/intelligence/live');
        const data = await res.json();
        setLiveIntel(data);

        const target = new Date(data.next_major_event.date).getTime();
        const now = new Date().getTime();
        const diff = target - now;
        
        if (diff > 0) {
          setCountdown({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          });
        }
      } catch (e) {
        console.error("Failed to fetch live intel", e);
      }
    };
    fetchLiveIntel();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Real-time Countdown */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-[3.5rem] p-12 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-primary" />
                <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Operational Intel Hub</span>
              </div>
              
              <AnimatePresence mode="wait">
                {liveIntel ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tighter leading-tight">
                      {liveIntel.next_major_event.title}
                    </h1>
                    <p className="text-slate-400 text-sm mb-10 max-w-lg leading-relaxed">
                      {liveIntel.next_major_event.description}
                    </p>
                    
                    <div className="flex gap-8">
                      {[
                        { label: 'Days', val: countdown.days },
                        { label: 'Hours', val: countdown.hours },
                        { label: 'Minutes', val: countdown.mins }
                      ].map((t, i) => (
                        <div key={i} className="text-center">
                          <p className="text-5xl font-black text-white mb-1">{t.val.toString().padStart(2, '0')}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t.label}</p>
                        </div>
                      ))}
                      <div className="w-px h-12 bg-white/10 mx-2 self-center" />
                      <div className="self-center">
                        <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">Countdown Active</p>
                        <p className="text-[10px] text-slate-500 font-bold">{new Date(liveIntel.next_major_event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-4 py-20 text-slate-500">
                    <Loader2 className="animate-spin" /> Fetching live intel...
                  </div>
                )}
              </AnimatePresence>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
          </div>

          {/* Real-time Calendar with Hover Details */}
          <div className="bg-slate-900/40 border border-white/10 rounded-[3.5rem] p-10 relative">
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <Calendar size={20} className="text-primary" /> Live Calendar
            </h3>
            <div className="space-y-6 relative">
              {liveIntel ? (
                liveIntel.calendar.map((event: any, i: number) => (
                  <div 
                    key={i} 
                    onMouseEnter={() => setHoveredEvent(event)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    className="flex items-center gap-4 group cursor-pointer relative"
                  >
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">MAY</p>
                      <Zap size={16} className="text-primary mt-1" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{event.title}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{event.date} • {event.type}</p>
                    </div>

                    {/* Pop-up Box */}
                    <AnimatePresence>
                      {hoveredEvent === event && (
                        <motion.div
                          initial={{ opacity: 0, x: -10, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -10, scale: 0.95 }}
                          className="absolute right-full mr-6 top-0 w-80 bg-slate-900 border border-primary/30 rounded-3xl p-6 shadow-2xl z-[100] backdrop-blur-2xl"
                        >
                          <div className="mb-4 pb-4 border-b border-white/5">
                            <h4 className="text-primary font-black uppercase text-[10px] tracking-widest mb-1">{event.details?.state_jurisdiction} Operational Brief</h4>
                            <p className="text-white font-bold">{event.title}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                               <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Election Date</p>
                               <p className="text-xs text-white font-bold">{event.details?.election_date}</p>
                            </div>
                            <div>
                               <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Result Date</p>
                               <p className="text-xs text-emerald-500 font-bold">{event.details?.result_date}</p>
                            </div>
                            <div>
                               <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Total Seats</p>
                               <p className="text-xs text-white font-bold">{event.details?.total_seats}</p>
                            </div>
                            <div>
                               <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Constituencies</p>
                               <p className="text-xs text-white font-bold">{event.details?.total_constituencies}</p>
                            </div>
                          </div>

                          <div>
                             <p className="text-[8px] text-slate-500 font-black uppercase mb-2">Primary Nominations</p>
                             <div className="space-y-2">
                                {event.details?.candidates.map((cand: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    <span className="text-[10px] text-slate-300 font-medium">{cand}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="space-y-4 opacity-20">
                  {[1, 2, 3].map(i => <div key={i} className="h-14 bg-white/10 rounded-2xl animate-pulse" />)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ConstituencyPulse />
          <MythBuster />
        </div>
      </div>
    </div>
  );
}
