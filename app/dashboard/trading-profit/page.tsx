'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { User, TradingProfit, Investment } from '@/types';
import { TrendingUp, Calendar, ShieldCheck, Activity, Award, CheckCircle2, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TradingProfitPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profits, setProfits] = useState<TradingProfit[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const refreshData = () => {
    const active = mockStore.getActiveUser();
    setUser(active);
    if (active) {
      setProfits(mockStore.getTradingProfits(active.id));
      setInvestments(mockStore.getInvestments(active.id));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!user) return null;

  const totalEligibleCapital = investments
    .filter(i => i.status === 'APPROVED')
    .reduce((sum, i) => sum + i.approvedAmount, 0);

  const totalAccumulatedProfit = profits.reduce((sum, p) => sum + p.amount, 0);

  // Prepare chart data chronologically
  const chartData = [...profits]
    .reverse()
    .map(p => ({
      date: p.date,
      dailyProfit: p.amount,
      capital: p.eligibleCapital,
    }));

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel-gold rounded-2xl p-6 border border-gold-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_25px_rgba(212,175,55,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" /> Mon–Fri Trading Schedule (0.60% Daily Rate)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Daily Trading Profit Ledger</h1>
          <p className="text-sm text-silver-300 mt-1">
            Trading profit is generated on eligible capital Monday through Friday. Saturday and Sunday are non-trading days.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-obsidian-900/80 border border-gold-500/30 px-5 py-3 rounded-xl">
            <p className="text-[10px] text-gold-300 font-bold uppercase tracking-wider">Accumulated Profit</p>
            <p className="text-2xl font-black text-gold-400">${totalAccumulatedProfit.toFixed(2)}</p>
          </div>
          <div className="bg-obsidian-900/80 border border-obsidian-750 px-5 py-3 rounded-xl">
            <p className="text-[10px] text-silver-400 font-bold uppercase tracking-wider">Eligible Capital</p>
            <p className="text-2xl font-black text-white">${totalEligibleCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Trading Performance Area Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-400" /> Daily Profit Yield Performance
            </h3>
            <p className="text-xs text-silver-400">Historical trading profit credits ($USD)</p>
          </div>
          <div className="bg-obsidian-850 px-3 py-1 rounded-lg border border-obsidian-750 text-xs text-gold-300 font-mono">
            Rate: 0.60% / Trading Day
          </div>
        </div>

        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={val => `$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f141d', borderColor: '#d4af37', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Profit Credit']}
                />
                <Area type="monotone" dataKey="dailyProfit" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-silver-500">
              No daily profit records available yet.
            </div>
          )}
        </div>
      </div>

      {/* Daily Profit Ledger Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <h3 className="text-base font-bold text-white mb-4">Detailed Daily Profit Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Trading Date</th>
                <th className="p-3.5">Capital Base</th>
                <th className="p-3.5">Applied Rate</th>
                <th className="p-3.5">Profit Credited</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Credited Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {profits.map(tp => (
                <tr key={tp.id} className="hover:bg-obsidian-850/60 transition-all">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{tp.id}</td>
                  <td className="p-3.5 font-mono font-bold text-white flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    {tp.date}
                  </td>
                  <td className="p-3.5 font-mono text-silver-300">${tp.eligibleCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="p-3.5 font-mono font-bold text-gold-400">{(tp.rate * 100).toFixed(2)}%</td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-400 text-sm">+${tp.amount.toFixed(2)}</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> {tp.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-silver-400">{new Date(tp.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {profits.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-silver-500">
                    No profit records logged yet.
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
