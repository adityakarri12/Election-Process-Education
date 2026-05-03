'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type: 'error' | 'success' | 'warning';
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.95 }}
          className={cn(
            "fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] min-w-[320px] max-w-md p-4 rounded-3xl border shadow-2xl backdrop-blur-xl flex items-center gap-4",
            type === 'error' ? "bg-red-950/90 border-red-500/50 text-red-200" : 
            type === 'warning' ? "bg-amber-950/90 border-amber-500/50 text-amber-200" :
            "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
            type === 'error' ? "bg-red-500 text-white" : 
            type === 'warning' ? "bg-amber-500 text-white" :
            "bg-emerald-500 text-white"
          )}>
            {type === 'error' ? <ShieldAlert size={20} /> : <Zap size={20} />}
          </div>
          <div className="flex-grow">
            <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-0.5">{type} notification</p>
            <p className="text-sm font-bold leading-tight">{message}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
