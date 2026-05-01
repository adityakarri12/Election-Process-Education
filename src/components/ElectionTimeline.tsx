import React from 'react';
import { UserPlus, Search, MapPin, Vote, Trophy, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={24} />,
    title: "Voter Registration",
    desc: "Check your eligibility and register through official government portals. Most jurisdictions require registration 30 days before Election Day.",
    tag: "Preparation"
  },
  {
    icon: <Search size={24} />,
    title: "Candidate Education",
    desc: "Research candidates' platforms and policies. Use non-partisan guides to compare stances on key issues that matter to you.",
    tag: "Research"
  },
  {
    icon: <MapPin size={24} />,
    title: "Polling Plan",
    desc: "Locate your assigned polling station or request a mail-in ballot. Verify the required identification documents in your state.",
    tag: "Logistics"
  },
  {
    icon: <Vote size={24} />,
    title: "Casting Your Vote",
    desc: "Vote early, by mail, or on Election Day. Follow all instructions on your ballot to ensure your vote is counted correctly.",
    tag: "Action"
  },
  {
    icon: <Trophy size={24} />,
    title: "Results & Certification",
    desc: "Follow official counts from election boards. Understand the certification process that verifies the final outcome.",
    tag: "Outcome"
  }
];

export const ElectionTimeline = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-6 group">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              {step.icon}
            </div>
            {i !== steps.length - 1 && (
              <div className="w-0.5 flex-grow bg-white/5 my-2" />
            )}
          </div>
          <div className="flex-grow pb-12">
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 group-hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{step.title}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                  {step.tag}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
