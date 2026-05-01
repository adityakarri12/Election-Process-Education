import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Users, ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="bg-slate-950 pt-32 pb-20 border-b border-white/5">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1]">
              Demystifying the <br />
              <span className="gradient-text">Election Process</span> for Everyone
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Access real-time civic data, interactive roadmaps, and AI-powered guidance to navigate your democratic journey with confidence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <a href="#lookup" className="btn btn-primary px-8 py-4">
                Find Your Reps <ArrowRight size={20} />
              </a>
              <a href="#roadmap" className="btn btn-outline px-8 py-4">
                Explore Roadmap
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { icon: <ShieldCheck className="text-blue-500" />, title: "Verified Data", desc: "Sourced directly from the official Google Civic Information API." },
              { icon: <Globe className="text-blue-500" />, title: "Complete Journey", desc: "A comprehensive roadmap from voter registration to counting day." },
              { icon: <Users className="text-blue-500" />, title: "AI Assistance", desc: "Get instant answers to complex election questions via Gemini AI." }
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
