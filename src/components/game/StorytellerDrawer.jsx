import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

export default function StorytellerDrawer({ isOpen, onClose }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Create conversation on first open
  useEffect(() => {
    if (!isOpen) return;
    if (conversationRef.current) return;
    async function init() {
      const conv = await base44.agents.createConversation({ agent_name: 'cosmos_storyteller' });
      conversationRef.current = conv;
      setConversation(conv);
      setMessages(conv.messages || []);
    }
    init();
  }, [isOpen]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!conversation?.id) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [conversation?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const conversationRef = useRef(null);

  const handleSend = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);

    // Wait for conversation to be ready if not yet initialized
    let conv = conversationRef.current;
    if (!conv) {
      conv = await base44.agents.createConversation({ agent_name: 'cosmos_storyteller' });
      conversationRef.current = conv;
      setConversation(conv);
      setMessages(conv.messages || []);
    }

    await base44.agents.addMessage(conv, { role: 'user', content: text });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const visibleMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant');
  const isStreaming = messages.some(m => m.role === 'assistant' && m.status === 'streaming');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col bg-card border-l border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold text-sm text-foreground">Ask me anything about the universe</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {visibleMessages.length === 0 && !sending && (
                <div className="text-center pt-8">
                  <Sparkles className="w-8 h-8 text-primary/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ask me anything about the universe — from the tiniest quark to the edges of the observable cosmos.
                  </p>
                  <div className="mt-4 space-y-2 text-left">
                   {[
                     "Why don't we fall through the floor if atoms are mostly empty space?",
                     "Could there be life on other planets in our galaxy?",
                     "What actually happens inside a black hole?",
                     "If the universe is expanding, what is it expanding into?",
                   ].map((q, i) => (
                     <button
                       key={i}
                       onClick={() => handleSend(q)}
                       className="w-full text-left text-xs px-3 py-2.5 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                     >
                       {q}
                     </button>
                   ))}
                  </div>
                </div>
              )}

              {visibleMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/60 text-foreground border border-border/50'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown className="prose prose-sm max-w-none prose-p:my-1 prose-p:leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {(sending || isStreaming) && (
                <div className="flex justify-start">
                  <div className="bg-secondary/60 border border-border/50 rounded-2xl px-3 py-2.5">
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border shrink-0">
              <div className="flex items-end gap-2 bg-secondary/40 rounded-xl border border-border px-3 py-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about anything in the cosmos…"
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-28"
                  style={{ fieldSizing: 'content' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1.5">Press Enter to send</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}