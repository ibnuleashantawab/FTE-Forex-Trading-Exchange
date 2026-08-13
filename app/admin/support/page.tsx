'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { SupportTicket, SupportMessage } from '@/types';
import { HelpCircle, ShieldAlert, Send, CheckCircle2, Lock, MessageSquare, Tag } from 'lucide-react';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [replyInput, setReplyInput] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const refreshData = () => {
    const tkts = mockStore.getTickets();
    setTickets(tkts);

    if (activeTicket) {
      setMessages(mockStore.getMessages(activeTicket.id));
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

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeTicket) return;

    mockStore.addSupportMessage(activeTicket.id, 'admin-1', replyInput, isInternalNote);
    setReplyInput('');
    setIsInternalNote(false);
    refreshData();
  };

  const handleUpdateStatus = (newStatus: any) => {
    if (!activeTicket) return;
    mockStore.updateTicketStatus(activeTicket.id, newStatus, 'admin-1');
    refreshData();
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Staff Ticket Management & Dispute Resolution (SRS §7.7)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Support Desk Control</h1>
          <p className="text-sm text-silver-400 mt-1">
            Reply to user tickets, record internal staff investigation notes, and update ticket lifecycle states.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Left List */}
        <div className="glass-panel rounded-2xl p-4 border border-obsidian-750 flex flex-col gap-2">
          <h3 className="text-xs font-bold text-silver-400 uppercase tracking-wider px-2 py-1">Incoming Tickets</h3>
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
                  <p className="text-[10px] text-silver-500">From: {tkt.userName} ({tkt.userEmail})</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Thread View */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          {activeTicket ? (
            <>
              {/* Top Header Controls */}
              <div className="pb-4 border-b border-obsidian-750 mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gold-400">{activeTicket.id}</span>
                    <span className="text-xs text-silver-400">User: {activeTicket.userName}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-0.5">{activeTicket.subject}</h2>
                </div>

                <div className="flex items-center gap-2">
                  {(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                        activeTicket.status === st
                          ? 'bg-gold-500 text-obsidian-950 shadow'
                          : 'bg-obsidian-850 hover:bg-obsidian-800 text-silver-400 border border-obsidian-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[400px] mb-4 pr-2">
                {messages.map(msg => {
                  const isAdmin = msg.senderRole === 'ADMIN';
                  const isInternal = msg.isInternalNote;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-silver-400">
                          {msg.senderName} ({msg.senderRole}) {isInternal && <span className="text-amber-400 font-bold">[INTERNAL STAFF NOTE]</span>}
                        </span>
                        <span className="text-[10px] text-silver-500">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isInternal
                            ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200 rounded-tr-none'
                            : isAdmin
                            ? 'bg-gold-500 text-obsidian-950 font-medium rounded-tr-none'
                            : 'bg-obsidian-850 border border-obsidian-750 text-silver-200 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Staff Reply Form */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-obsidian-750 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-silver-400 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={e => setIsInternalNote(e.target.checked)}
                      className="rounded bg-obsidian-850 border-obsidian-700 text-amber-500"
                    />
                    <span className="font-bold text-amber-400">Post as Internal Staff Note (Hidden from User)</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyInput}
                    onChange={e => setReplyInput(e.target.value)}
                    placeholder={isInternalNote ? 'Type internal staff investigation note...' : 'Type public admin reply to user...'}
                    className="flex-1 bg-obsidian-850 border border-obsidian-700 focus:border-gold-500 text-xs text-white px-4 py-3 rounded-xl focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-5 py-3 rounded-xl text-xs transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Reply
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-silver-500">
              Select a ticket to manage support thread.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
