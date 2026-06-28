import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Footer from '@/components/game/Footer';
import { base44 } from '@/api/base44Client';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: 'jayajohnyramchandani@gmail.com',
      subject: `Powers of Ten – Message from ${form.name}`,
      body: `From: ${form.name} <${form.email}>\n\n${form.message}`,
    });
    setSending(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-grotesk">
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to game
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold font-mono shimmer-text mb-2">Contact</h1>
          <p className="text-muted-foreground mb-10">Powers of Ten: Our Universe</p>

          {/* Direct contact */}
          <section className="mb-10">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Globe className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-0.5">Website</p>
                  <a
                    href="https://welearnwegrow.bio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline font-semibold"
                  >
                    welearnwegrow.bio
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Contact form */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">Send a Message</h2>
            {submitted ? (
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 text-center">
                <p className="text-sm font-semibold text-foreground">Message sent!</p>
                <p className="text-xs text-muted-foreground mt-1">Thank you — we'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors resize-none"
                    placeholder="Your message…"
                  />
                </div>
                <Button type="submit" disabled={sending} className="w-full flex items-center justify-center gap-2 rounded-xl">
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending…' : 'Send Message'}
                </Button>
              </form>
            )}
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}