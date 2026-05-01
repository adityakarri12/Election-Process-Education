'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';

const terms = [
  { term: "Constituency", def: "A specific geographical area that elects a representative to a legislative body." },
  { term: "Electoral Roll", def: "A compiled list of all citizens eligible to vote in a specific constituency." },
  { term: "Delimitation", def: "The process of fixing boundaries of territorial constituencies in a country." },
  { term: "Model Code of Conduct", def: "Guidelines issued by the ECI for conduct of political parties and candidates during elections." },
  { term: "Universal Adult Suffrage", def: "The right of all adult citizens to vote regardless of wealth, income, gender, or social status." },
  { term: "VVPAT", def: "Voter Verifiable Paper Audit Trail - A method of providing feedback to voters using a paper slip." }
];

export function Glossary() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = terms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-12">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input 
          type="text" 
          placeholder="Search civic terms..." 
          suppressHydrationWarning
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-primary outline-none transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-3">
        {filtered.map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:bg-white/[0.07]">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              suppressHydrationWarning
              className="w-full p-6 flex items-center justify-between text-left"
            >
              <span className="text-lg font-bold text-white">{item.term}</span>
              <ChevronDown className={`text-slate-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} size={20} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <p className="text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                    {item.def}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
