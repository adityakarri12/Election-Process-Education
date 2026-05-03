'use client';

import dynamic from 'next/dynamic';

const ChatAssistant = dynamic(
  () => import('@/components/features/ChatAssistant').then(mod => mod.ChatAssistant),
  { ssr: false }
);

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      <main id="main-content" className="flex-grow pt-16 pb-2 flex items-center justify-center">
        <div className="container mx-auto px-6 h-full flex flex-col">
          <div className="flex-grow">
            <ChatAssistant />
          </div>
        </div>
      </main>
    </div>
  );
}
