'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { User } from '@/types';
import { History, Search, ArrowDownCircle, ArrowUpCircle, TrendingUp, Gift, Award, Filter, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function TransactionHistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [combinedRecords, setCombinedRecords] = useState<any[]>([]);

  const refreshData = () => {
    const active = mockStore.getActiveUser();
    setUser(active);
    if (!active) return;

    const deps = mockStore.getDeposits(active.id).map(d => ({
      id: d.id,
      category: 'DEPOSIT',
      title: `Deposit via ${d.method}`,
      amount: d.netAmount,
      grossAmount: d.grossAmount,
      fee: d.fee,
      status: d.status,
      date: d.createdAt,
      icon: ArrowDownCircle,
      color: 'text-blue-400',
    }));

    const wths = mockStore.getWithdrawals(active.id).map(w => ({
      id: w.id,
      category: 'WITHDRAWAL',
      title: `Withdrawal (${w.walletType.replace('_', ' ')})`,
      amount: -w.requestedAmount,
      grossAmount: w.requestedAmount,
      fee: w.fee,
      status: w.status,
      date: w.createdAt,
      icon: ArrowUpCircle,
      color: 'text-amber-400',
    }));

    const profs = mockStore.getTradingProfits(active.id).map(p => ({
      id: p.id,
      category: 'TRADING_PROFIT',
      title: `Daily Trading Profit (0.60%)`,
      amount: p.amount,
      grossAmount: p.amount,
      fee: 0,
      status: p.status,
      date: p.createdAt,
      icon: TrendingUp,
      color: 'text-emerald-400',
    }));

    const comms = mockStore.getCommissions(active.id).map(c => ({
      id: c.id,
      category: 'COMMISSION',
      title: `Gen-1 Commission (${c.sourceMemberName})`,
      amount: c.amount,
      grossAmount: c.amount,
      fee: 0,
      status: c.status,
      date: c.createdAt,
      icon: Gift,
      color: 'text-purple-400',
    }));

    const rwds = mockStore.getRewards(active.id).map(r => ({
      id: r.id,
      category: 'REWARD',
      title: `Milestone Reward #${r.milestoneIndex}`,
      amount: r.rewardAmount,
      grossAmount: r.rewardAmount,
      fee: 0,
      status: r.status,
      date: r.createdAt,
      icon: Award,
      color: 'text-gold-400',
    }));

    const all = [...deps, ...wths, ...profs, ...comms, ...rwds].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setCombinedRecords(all);
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!user) return null;

  const filtered = combinedRecords.filter(item => {
    const matchesFilter = filterType === 'ALL' || item.category === filterType;
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" /> Unified Auditable Financial Ledger (SRS §5.10)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Transaction History</h1>
          <p className="text-sm text-silver-400 mt-1">
            Search, filter, and inspect all deposits, withdrawals, trading profits, commissions, and milestone rewards.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'All Transactions', key: 'ALL' },
            { label: 'Deposits', key: 'DEPOSIT' },
            { label: 'Withdrawals', key: 'WITHDRAWAL' },
            { label: 'Trading Profits', key: 'TRADING_PROFIT' },
            { label: 'Gen-1 Bonus', key: 'COMMISSION' },
            { label: 'Rewards', key: 'REWARD' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === tab.key
                  ? 'bg-gold-500 text-obsidian-950 shadow-md'
                  : 'bg-obsidian-850 hover:bg-obsidian-800 text-silver-300 border border-obsidian-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-silver-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by ID or description..."
            className="w-full bg-obsidian-850 border border-obsidian-750 focus:border-gold-500 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl focus:outline-none"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Record ID</th>
                <th className="p-3.5">Type & Description</th>
                <th className="p-3.5">Gross / Requested</th>
                <th className="p-3.5">Fee (3%)</th>
                <th className="p-3.5">Net Amount ($USD)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {filtered.map(item => {
                const Icon = item.icon;
                const isPositive = item.amount > 0;
                return (
                  <tr key={item.id} className="hover:bg-obsidian-850/60 transition-all">
                    <td className="p-3.5 font-mono text-gold-300 font-bold">{item.id}</td>
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      {item.title}
                    </td>
                    <td className="p-3.5 font-mono text-silver-400">${item.grossAmount.toFixed(2)}</td>
                    <td className="p-3.5 font-mono text-amber-400">{item.fee > 0 ? `-$${item.fee.toFixed(2)}` : '-'}</td>
                    <td className={`p-3.5 font-mono font-extrabold text-sm ${isPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isPositive ? `+$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-obsidian-800 text-silver-300 border border-obsidian-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-silver-400">{new Date(item.date).toLocaleString()}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-silver-500">
                    No matching financial records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
