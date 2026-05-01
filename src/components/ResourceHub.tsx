import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Scale, Landmark, FileText, Info } from 'lucide-react';

const resources = [
  {
    icon: <BookOpen className="text-blue-400" />,
    title: "Voter Bill of Rights",
    desc: "Understand your fundamental rights as a citizen and voter.",
    links: ["Constitutional Protections", "Voting Act 1965"]
  },
  {
    icon: <Scale className="text-amber-400" />,
    title: "How to Evaluate Candidates",
    desc: "A framework for analyzing campaign promises and track records.",
    links: ["Policy Analysis Guide", "Debate Watchlist"]
  },
  {
    icon: <Landmark className="text-purple-400" />,
    title: "Government Structure",
    desc: "The roles and responsibilities of the offices up for election.",
    links: ["Legislative vs Executive", "Local vs National"]
  },
  {
    icon: <FileText className="text-emerald-400" />,
    title: "Mail-in Voting Guide",
    desc: "Everything you need to know about absentee and postal ballots.",
    links: ["Deadlines", "Security Measures"]
  }
];

export const ResourceHub = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {resources.map((res, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -5 }}
          className="glass-card p-6 flex flex-col h-full"
        >
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
            {res.icon}
          </div>
          <h3 className="text-lg mb-2 font-display">{res.title}</h3>
          <p className="text-slate-400 text-sm mb-6 flex-grow">{res.desc}</p>
          <div className="space-y-2">
            {res.links.map((link, j) => (
              <a key={j} href="#" className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-white transition-colors">
                <Info size={12} />
                {link}
              </a>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
