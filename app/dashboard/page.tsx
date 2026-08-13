'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockStore } from '@/lib/data/mockStore';
import { User, Investment, TradingProfit, DepositRecord, WithdrawalRecord } from '@/types';
import {
  Wallet,
  TrendingUp,
  Users,
  Award,
  ArrowDownCircle,
  ArrowUpCircle,
  Share2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap,
  Gift,
  ShieldCheck,
  Activity,
  Calendar,
} from 'lucide-react';
import { checkLevel1Eligibility } from '@/lib/services/financialEngine';

export default function UserDashboardHome() {
  const [user, setUser] = useState<User | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [profits, setProfits] = useState<TradingProfit[]>([]);
  const [teamVolume, setTeamVolume] = useState({ totalTeamVolume: 0, completedMilestones: 0, nextMilestoneTarget: 50000 });
  const [level1Data, setLevel1Data] = useState<any>(null);

  const refreshData = () => {
    const active = mockStore.getActiveUser();
    setUser(active);
    if (active) {
      const invs = mockStore.getInvestments(active.id);
      setInvestments(invs);
      const profs = mockStore.getTradingProfits(active.id);
      setProfits(profs);
      const refs = mockStore.getDirectReferrals(active.id);
      const l1 = checkLevel1Eligibility(active, invs, refs);
      setLevel1Data(l1);
      const tv = mockStore.getTeamVolume(active.id);
      setTeamVolume(tv);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const totalEligibleCapital = investments
    .filter(i => i.status === 'APPROVED')
    .reduce((sum, i) => sum + i.approvedAmount, 0);

  const todayTradingProfit = (totalEligibleCapital * 0.006).toFixed(2);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner / Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-800 border border-gold-500/30 p-6 md:p-8 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" /> FTE Financial Policy Active (Daily Rate: 0.60%)
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Investor Command Center
            </h1>
            <p className="text-sm text-silver-400 mt-2 leading-relaxed">
              Track your daily trading profits, direct referral performance, Level-1 qualification eligibility, and \$50,000 team milestone rewards in real time.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/deposit"
              className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-5 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105"
            >
              <ArrowDownCircle className="w-4 h-4" /> Deposit Funds
            </Link>
            <Link
              href="/dashboard/withdraw"
              className="bg-obsidian-800 hover:bg-obsidian-750 text-silver-200 border border-obsidian-700 px-5 py-3 rounded-xl text-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <ArrowUpCircle className="w-4 h-4 text-gold-400" /> Withdraw
            </Link>
          </div>
        </div>
      </div>

      {/* Financial Metrics Grid (4 Key Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Main Capital Card */}
        <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 hover:border-gold-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-silver-400 uppercase tracking-wider">Main Investment</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              ${totalEligibleCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-silver-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Approved Capital
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-obsidian-750/60 flex items-center justify-between text-xs text-silver-400">
            <span>Available Balance:</span>
            <span className="font-semibold text-white">${user.mainBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* Available Profit Card */}
        <div className="glass-panel-gold rounded-2xl p-5 border border-gold-500/30 hover:border-gold-500/60 transition-all flex flex-col justify-between shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider">Available Profit</span>
            <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/40">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gold-400">
              ${user.profitBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-gold-300/80 mt-1 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-gold-400" /> Mon–Fri 0.60% Daily Credited
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gold-500/20 flex items-center justify-between text-xs text-gold-300/90">
            <span>Est. Next Trading Profit:</span>
            <span className="font-bold text-gold-300">+${todayTradingProfit}</span>
          </div>
        </div>

        {/* Gen-1 Commission Card */}
        <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 hover:border-gold-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-silver-400 uppercase tracking-wider">Gen-1 Bonus (40%)</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              ${user.totalCommissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-silver-400 mt-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-400" /> 40% of Direct Team Profits
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-obsidian-750/60 flex items-center justify-between text-xs text-silver-400">
            <span>Level-1 Status:</span>
            <span className={`font-bold ${user.level1Qualified ? 'text-emerald-400' : 'text-amber-400'}`}>
              {user.level1Qualified ? 'Qualified' : 'In Progress'}
            </span>
          </div>
        </div>

        {/* Team Volume & Rewards Card */}
        <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 hover:border-gold-500/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-silver-400 uppercase tracking-wider">Milestone Rewards</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              ${user.totalRewardsEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-silver-400 mt-1">
              ${teamVolume.totalTeamVolume.toLocaleString()} / ${teamVolume.nextMilestoneTarget.toLocaleString()} Team Volume
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-obsidian-750/60 flex items-center justify-between text-xs text-silver-400">
            <span>Completed Milestones:</span>
            <span className="font-bold text-amber-400">{teamVolume.completedMilestones} x $10,000</span>
          </div>
        </div>
      </div>

      {/* Level-1 Qualification Status & Progress Section */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`p-4 rounded-2xl border ${level1Data?.isQualified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Level-1 Sponsor Qualification Status</h3>
              {level1Data?.isQualified ? (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Active & Earning 40% Bonus
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Requirements Pending
                </span>
              )}
            </div>
            <p className="text-xs text-silver-400 mt-1 max-w-xl">
              To qualify for Level-1 40% daily generation commission on your direct referrals, you must hold at least \$500 in approved personal investment and sponsor at least 4 direct members with $\ge \$500$ investment each.
            </p>
          </div>
        </div>

        {/* Qualification Progress Chips */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="bg-obsidian-850 border border-obsidian-750 px-4 py-3 rounded-xl flex-1 lg:flex-initial">
            <p className="text-[10px] text-silver-400 font-bold uppercase tracking-wider">Own Investment ($\ge \$500$)</p>
            <p className={`text-sm font-bold ${level1Data?.ownCapitalQualified ? 'text-emerald-400' : 'text-amber-400'} flex items-center gap-1 mt-0.5`}>
              {level1Data?.ownCapitalQualified ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              ${level1Data?.ownCapital.toLocaleString()} / $500
            </p>
          </div>

          <div className="bg-obsidian-850 border border-obsidian-750 px-4 py-3 rounded-xl flex-1 lg:flex-initial">
            <p className="text-[10px] text-silver-400 font-bold uppercase tracking-wider">Direct Referrals ($\ge 4$ with $\ge \$500$)</p>
            <p className={`text-sm font-bold ${level1Data?.referralsCountQualified ? 'text-emerald-400' : 'text-amber-400'} flex items-center gap-1 mt-0.5`}>
              {level1Data?.referralsCountQualified ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {level1Data?.qualifiedReferralsCount} / 4 Members
            </p>
          </div>

          <Link
            href="/dashboard/team"
            className="bg-obsidian-800 hover:bg-gold-500/20 text-gold-300 border border-obsidian-700 hover:border-gold-500/40 px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ml-auto"
          >
            View My Team <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Trading Profit & Transaction Ledgers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trading Profit Credits */}
        <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold-400" /> Recent Trading Profit Credits
              </h3>
              <p className="text-xs text-silver-400">0.60% calculated daily on eligible capital (Mon–Fri)</p>
            </div>
            <Link href="/dashboard/trading-profit" className="text-xs text-gold-400 hover:underline font-semibold">
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-2.5">
            {profits.slice(0, 4).map(tp => (
              <div key={tp.id} className="bg-obsidian-850 border border-obsidian-750 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-200">{tp.date}</p>
                    <p className="text-[10px] text-silver-400">Capital Base: ${tp.eligibleCapital.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-emerald-400">+${tp.amount.toFixed(2)}</p>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded font-mono">0.60% Rate</span>
                </div>
              </div>
            ))}
            {profits.length === 0 && (
              <p className="text-xs text-silver-400 text-center py-6">No profit credits recorded yet.</p>
            )}
          </div>
        </div>

        {/* Referral Link & Quick Sharing */}
        <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-gold-400" /> Personal Referral Link
              </h3>
              <p className="text-xs text-silver-400">Invite investors to earn 40% Generation-1 trading bonus</p>
            </div>
            <Link href="/dashboard/referral" className="text-xs text-gold-400 hover:underline font-semibold">
              Share Center
            </Link>
          </div>

          <div className="bg-obsidian-850 border border-gold-500/30 p-4 rounded-xl flex flex-col gap-3">
            <div>
              <span className="text-[10px] text-silver-400 font-bold uppercase tracking-wider">Your Referral Code</span>
              <p className="text-lg font-mono font-extrabold text-gold-400 tracking-wider">{user.referralCode}</p>
            </div>

            <div className="flex items-center gap-2 bg-obsidian-900 p-2 rounded-lg border border-obsidian-750">
              <input
                type="text"
                readOnly
                value={`https://fte.com/register?ref=${user.referralCode}`}
                className="bg-transparent text-xs text-silver-300 w-full focus:outline-none font-mono"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://fte.com/register?ref=${user.referralCode}`);
                  alert('Referral URL copied to clipboard!');
                }}
                className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-3 py-1.5 rounded text-xs transition-all flex items-center gap-1 shrink-0"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-obsidian-750 text-xs text-silver-400 flex items-center justify-between">
            <span>Generation-1 Commission Rate:</span>
            <span className="font-extrabold text-gold-400">40% Daily Income</span>
          </div>
        </div>
      </div>
    </div>
  );
}
