'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { User, SupportTicket, SupportMessage } from '@/types';
import { HelpCircle, PlusCircle, MessageSquare, Send, CheckCircle2, Clock, ShieldAlert, UserCheck, Paperclip } from 'lucide-react';

export default function SupportCenterPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<any>('DEPOSIT');
  const [txRef, setTxRef] = useState('');
  const [initialMsg, setInitialMsg] = useState('');

  const [replyInput, setReplyInput] = useState('');

  const refreshData = () => {
    const active = mockStore.getActiveUser();
    setUser(active);
    if (!active) return;

    const tkts = mockStore.getTickets(active.id);
    setTickets(tkts);

    if (activeTicket) {
      const msgs = mockStore.getMessages(activeTicket.id);
      setMessages(msgs);
    } else if (tkts.length > 0) {
      setActiveTicket(tkts[0]);
      setMessages(mockStore.getMessages(tkts[0].id));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (activeTicket) {
      setMessages(mockStore.getMessages(activeTicket.id));
    }
  }, [activeTicket]);

  if (!user) return null;

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMsg.trim()) return;

    const tkt = mockStore.createSupportTicket(user.id, subject, category, txRef, initialMsg);
    setShowModal(false);
    setSubject('');
    setTxRef('');
    setInitialMsg('');
    setActiveTicket(tkt);
    refreshData();
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeTicket) return;

    mockStore.addSupportMessage(activeTicket.id, user.id, replyInput);
    setReplyInput('');
    refreshData();
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> 24/7 Transaction & Account Support Desk (SRS §6.8)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Support & Help Desk</h1>
          <p className="text-sm text-silver-400 mt-1">
            Open transaction-linked support tickets and message directly with administrators.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-5 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)]"
        >
          <PlusCircle className="w-4 h-4" /> Create New Ticket
        </button>
      </div>

      {/* Ticket Layout: Left List + Right Conversation Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Left Column: Tickets List */}
        <div className="glass-panel rounded-2xl p-4 border border-obsidian-750 flex flex-col gap-2">
          <h3 className="text-xs font-bold text-silver-400 uppercase tracking-wider px-2 py-1">Your Tickets</h3>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[550px] pr-1">
            {tickets.map(tkt => {
              const isSelected = activeTicket?.id === tkt.id;
              return (
                <button
                  key={tkt.id}
                  onClick={() => setActiveTicket(tkt)}
                  className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gold-500/10 border-gold-500/40 shadow-sm'
                      : 'bg-obsidian-850 hover:bg-obsidian-800 border-obsidian-750 text-silver-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-gold-400">{tkt.id}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-obsidian-900 border border-obsidian-750 text-silver-300">
                      {tkt.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white truncate mb-1">{tkt.subject}</p>
                  <span className="text-[10px] text-silver-500">{new Date(tkt.updatedAt).toLocaleString()}</span>
                </button>
              );
            })}
            {tickets.length === 0 && (
              <p className="text-xs text-silver-500 text-center py-12">No support tickets created yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Message Thread View */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          {activeTicket ? (
            <>
              {/* Ticket Top Meta Header */}
              <div className="pb-4 border-b border-obsidian-750 mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gold-400">{activeTicket.id}</span>
                    <span className="text-xs text-silver-500">({activeTicket.category})</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-0.5">{activeTicket.subject}</h2>
                  {activeTicket.transactionReference && (
                    <p className="text-xs text-silver-400 font-mono mt-0.5">
                      Transaction Ref: <code className="text-gold-300">{activeTicket.transactionReference}</code>
                    </p>
                  )}
                </div>
                <span className="bg-obsidian-850 text-gold-300 border border-gold-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Status: {activeTicket.status}
                </span>
              </div>

              {/* Message Thread Body */}
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[400px] mb-4 pr-2">
                {messages.map(msg => {
                  const isAdmin = msg.senderRole === 'ADMIN';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${isAdmin ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-silver-400 flex items-center gap-1">
                          {isAdmin ? <ShieldAlert className="w-3 h-3 text-amber-400" /> : <UserCheck className="w-3 h-3 text-gold-400" />}
                          {msg.senderName} ({msg.senderRole})
                        </span>
                        <span className="text-[10px] text-silver-500">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-obsidian-850 border border-gold-500/30 text-silver-200 rounded-tl-none'
                            : 'bg-gold-500 text-obsidian-950 font-medium rounded-tr-none shadow-md'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-obsidian-750 flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={e => setReplyInput(e.target.value)}
                  placeholder="Type your message reply..."
                  className="flex-1 bg-obsidian-850 border border-obsidian-700 focus:border-gold-500 text-xs text-white px-4 py-3 rounded-xl focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-5 py-3 rounded-xl text-xs transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-silver-500">
              Select or create a support ticket to start chatting.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-gold-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-gold-400" /> Create Support Ticket
            </h3>

            <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Summary of your request"
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white px-3 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white px-3 py-2.5 rounded-xl"
                  >
                    <option value="DEPOSIT">Deposit</option>
                    <option value="WITHDRAWAL">Withdrawal</option>
                    <option value="TRADING_PROFIT">Trading Profit</option>
                    <option value="COMMISSION">Commission</option>
                    <option value="ACCOUNT">Account / Level-1</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-1">Transaction Ref (Optional)</label>
                  <input
                    type="text"
                    value={txRef}
                    onChange={e => setTxRef(e.target.value)}
                    placeholder="e.g. dep-901"
                    className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white px-3 py-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-1">Initial Message</label>
                <textarea
                  required
                  rows={4}
                  value={initialMsg}
                  onChange={e => setInitialMsg(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-xs text-white px-3 py-2.5 rounded-xl focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-silver-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
