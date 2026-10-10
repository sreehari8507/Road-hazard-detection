import React, { FormEvent, useState } from 'react';
import { Bot, Send, ShieldCheck, X } from 'lucide-react';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export const RoadAI: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'I am Cyclops. Ask about a detected hazard, route safety, braking, or road conditions.'
    }
  ]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const nextMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(nextMessages);
    setInput('');
    setBusy(true);

    try {
      const response = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          user_location: window.location.pathname
        })
      });
      if (!response.ok) throw new Error('AI service unavailable');
      const data = await response.json();
      setMessages(current => [...current, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages(current => [
        ...current,
        { role: 'assistant', content: 'Cyclops is unavailable right now. Start the backend service and try again.' }
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Cyclops assistant"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-950/95 px-4 py-3 text-sm font-semibold text-cyan-200 shadow-xl shadow-cyan-950/40 backdrop-blur transition hover:border-cyan-300 hover:text-white"
      >
        <Bot className="h-4 w-4 text-cyan-300" />
        Cyclops
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6">
          <section className="flex h-[min(680px,calc(100vh-1.5rem))] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Cyclops assistant</h2>
                  <p className="text-xs text-slate-400">Connected to the road intelligence service</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close RoadAI" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <p className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-relaxed ${message.role === 'user' ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 bg-slate-950 text-slate-200'}`}>
                    {message.content}
                  </p>
                </div>
              ))}
              {busy && <p className="text-xs text-cyan-300">Cyclops is analysing your question...</p>}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-800 bg-slate-950 p-3">
              <input
                value={input}
                onChange={event => setInput(event.target.value)}
                placeholder="Ask Cyclops..."
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send message" className="rounded-lg bg-cyan-500 p-2 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
};
