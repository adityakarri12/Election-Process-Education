'use client';

import { Navbar } from '@/components/layout/Navbar';
import { ChatAssistant } from '@/components/features/ChatAssistant';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-grow pt-16 pb-2 flex items-center justify-center">
        <div className="container mx-auto px-6 h-full flex flex-col">
          <div className="flex-grow">
            <ChatAssistant />
          </div>
        </div>
      </main>
    </div>
  );
}
