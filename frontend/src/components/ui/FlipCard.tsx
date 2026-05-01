'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlipCardProps {
  title: string;
  description: string;
  details: string[];
  icon: React.ElementType;
}

export const FlipCard = ({ title, description, details, icon: Icon }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="relative h-[300px] w-full perspective-1000 cursor-pointer group"
      onClick={handleFlip}
    >
      <motion.div
        className="w-full h-full relative transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front Side */}
        <div className={cn(
          "absolute inset-0 w-full h-full backface-hidden bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-xl transition-all duration-300",
          isFlipped ? "border-primary/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "group-hover:border-primary/50"
        )}>
          <div className={cn(
            "w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-primary mb-6 transition-all duration-300",
            isFlipped ? "bg-primary text-white scale-110" : "group-hover:bg-primary group-hover:text-white"
          )}>
            <Icon size={32} />
          </div>
          <h4 className="text-2xl font-black text-white mb-2">{title}</h4>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-primary">
            <Sparkles size={12} /> CLICK TO FLIP
          </div>
        </div>

        {/* Back Side */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-primary/40 rounded-[2.5rem] p-8 flex flex-col rotate-y-180 transition-all duration-300",
            isFlipped ? "shadow-[0_0_40px_rgba(59,130,246,0.2),_0_0_80px_rgba(59,130,246,0.1)]" : ""
          )}
        >
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Info size={18} className="text-primary" />
            <h5 className="font-bold text-white text-lg">Legal Insight</h5>
          </div>
          <ul className="space-y-3">
            {details.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-xs text-slate-300 leading-relaxed text-left">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
