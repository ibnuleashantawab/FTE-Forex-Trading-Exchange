'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { PlayCircle, ShieldCheck, CheckCircle2, Activity, Calendar, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { CONSTANTS } from '@/lib/services/financialEngine';

export default function AdminCronControlPage() {
  const [simDate, setSimDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [logResults, setLogResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCronJob = () => {
    setIsRunning(true);
    setTimeout(() => {
      try {
        const res = mockStore.runDailyTradingProfitJob(simDate);
        setLogResults({
          date: simDate,
          success: true,
          ...res,
          timestamp: new Date().toISOString(),
        });
      } catch (err: any) {
        setLogResults({
          date: simDate,
          success: false,
          error: err.message || 'Execution error',
          timestamp: new Date().toISOString(),
        });
      }
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel-gold rounded-2xl p-6 border border-gold-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_25px_rgba(212,175,55,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" /> Automated Mon–Fri Trading Profit Engine (SRS §6.3 & §8.1)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Daily Profit Cron Controller</h1>
          <p className="text-sm text-silver-300 mt-1">
            Simulate or trigger daily trading profit distribution (0.60%), Gen-1 40% commissions, and team milestone detection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trigger Controller Form */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-gold-400" /> Manual Cron Job Trigger
            </h3>
            <p className="text-xs text-silver-400 mb-6">
              Select trading date and launch execution. Idempotency logic prevents duplicate crediting for the same trading date.
            </p>

            <div className="flex flex-col gap-4 bg-obsidian-850 p-4 rounded-xl border border-obsidian-750 mb-6">
              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                  Target Trading Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={simDate}
                  onChange={e => setSimDate(e.target.value)}
                  className="w-full bg-obsidian-900 border border-obsidian-700 text-white font-mono text-sm px-4 py-3 rounded-xl focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs text-silver-400 pt-2 border-t border-obsidian-750">
                <div>
                  <span className="text-[10px] uppercase font-bold text-silver-500">Rate</span>
                  <p className="font-mono text-gold-300 font-bold">0.60% / Day</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-silver-500">Commission</span>
                  <p className="font-mono text-purple-400 font-bold">40% to L1 Sponsor</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-silver-500">Locking</span>
                  <p className="font-mono text-emerald-400 font-bold">Idempotent Key</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleRunCronJob}
              disabled={isRunning}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-obsidian-950 font-black py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] text-base flex items-center justify-center gap-2"
            >
              {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
              {isRunning ? 'Processing Daily Calculations...' : `Execute Daily Profit Engine For ${simDate}`}
            </button>
          </div>
        </div>

        {/* Execution Log & Audit Result */}
        <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-400" /> Execution Audit Results
            </h3>
            <p className="text-xs text-silver-400 mb-4">Latest execution logs and state locking.</p>

            {logResults ? (
              <div className="bg-obsidian-850 p-4 rounded-xl border border-gold-500/30 flex flex-col gap-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-obsidian-750">
                  <span className="text-silver-400">Execution Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-silver-400">Trading Date:</span>
                  <span className="text-white font-bold">{logResults.date}</span>
                </div>

                {/* 1. Investor Profits Credited Details */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-obsidian-750">
                  <div className="flex items-center justify-between text-silver-300 font-bold">
                    <span>1. Investor Profits Credited:</span>
                    <span className="text-gold-400">+{logResults.profitsCredited} Records</span>
                  </div>
                  {logResults.profitDetails && logResults.profitDetails.length > 0 ? (
                    <div className="flex flex-col gap-1 pl-2 border-l-2 border-gold-500/40 text-[11px] text-silver-300">
                      {logResults.profitDetails.map((p: any, idx: number) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <span>{p.userName} (${p.eligibleCapital.toLocaleString()} Capital @ 0.60%)</span>
                          <span className="text-emerald-400 font-bold">+${p.profitAmount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-silver-500 italic pl-2">No new profits credited (or already credited for {logResults.date}).</p>
                  )}
                </div>

                {/* 2. Gen-1 Commissions Paid Details */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-obsidian-750">
                  <div className="flex items-center justify-between text-silver-300 font-bold">
                    <span>2. Gen-1 Commissions Paid:</span>
                    <span className="text-purple-400">+{logResults.commissionsPaid} Paid</span>
                  </div>
                  {logResults.commissionDetails && logResults.commissionDetails.length > 0 ? (
                    <div className="flex flex-col gap-1 pl-2 border-l-2 border-purple-500/40 text-[11px] text-silver-300">
                      {logResults.commissionDetails.map((c: any, idx: number) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <span>{c.sponsorName} from {c.sourceMemberName} (${c.sourceProfitAmount.toFixed(2)} Profit @ 40%)</span>
                          <span className="text-purple-400 font-bold">+${c.commissionAmount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-silver-500 italic pl-2">No Gen-1 commissions triggered.</p>
                  )}
                </div>

                {/* 3. Milestone Rewards Unlocked Details */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-obsidian-750">
                  <div className="flex items-center justify-between text-silver-300 font-bold">
                    <span>3. Milestone Rewards Unlocked:</span>
                    <span className="text-amber-400">+{logResults.rewardsUnlocked} Unlocked</span>
                  </div>
                  {logResults.rewardDetails && logResults.rewardDetails.length > 0 ? (
                    <div className="flex flex-col gap-1 pl-2 border-l-2 border-amber-500/40 text-[11px] text-silver-300">
                      {logResults.rewardDetails.map((r: any, idx: number) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <span>{r.userName} (Milestone #{r.milestoneIndex} @ ${r.threshold.toLocaleString()} Team Volume)</span>
                          <span className="text-amber-400 font-bold">+${r.rewardAmount.toLocaleString()} Unlocked</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-silver-500 italic pl-2">No milestone rewards unlocked.</p>
                  )}
                </div>

                <div className="pt-2 border-t border-obsidian-750 text-[10px] text-silver-500">
                  Logged at: {logResults.timestamp}
                </div>
              </div>
            ) : (
              <div className="bg-obsidian-850 p-8 rounded-xl border border-obsidian-750 text-center text-xs text-silver-500">
                Click execute button to run daily profit calculations.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
