'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { User, MilestoneReward } from '@/types';
import { Award, CheckCircle2, ShieldCheck, Trophy, Sparkles, AlertCircle } from 'lucide-react';
import { CONSTANTS } from '@/lib/services/financialEngine';

export default function RewardsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [rewards, setRewards] = useState<MilestoneReward[]>([]);
  const [teamVolume, setTeamVolume] = useState<any>(null);

  const refreshData = () => {
    const active = mockStore.getActiveUser();
    setUser(active);
    if (active) {
      setRewards(mockStore.getRewards(active.id));
      setTeamVolume(mockStore.getTeamVolume(active.id));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!user) return null;

  const currentVolume = teamVolume?.totalTeamVolume || 0;
  const nextTarget = teamVolume?.nextMilestoneTarget || 50000;
  const progressPercent = Math.min(100, Math.round((currentVolume / nextTarget) * 100));

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel-gold rounded-2xl p-6 border border-gold-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_25px_rgba(212,175,55,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" /> Team Investment Milestone Reward Plan (SRS §3.4)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Milestone Reward Center</h1>
          <p className="text-sm text-silver-300 mt-1">
            Every \$50,000 qualifying team investment volume unlocks an auditable \$10,000 milestone reward.
          </p>
        </div>

        <div className="bg-obsidian-900/80 border border-gold-500/30 px-6 py-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gold-300 font-bold uppercase tracking-wider">Total Rewards Paid</p>
            <p className="text-2xl font-black text-amber-400">${user.totalRewardsEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" /> Milestone Target Progress
            </h3>
            <p className="text-xs text-silver-400">Current Cumulative Team Volume vs Next Milestone Target</p>
          </div>
          <span className="text-sm font-extrabold font-mono text-gold-400">
            ${currentVolume.toLocaleString()} / ${nextTarget.toLocaleString()}
          </span>
        </div>

        {/* Outer Bar */}
        <div className="w-full h-4 bg-obsidian-850 rounded-full border border-obsidian-700 overflow-hidden p-0.5 mb-3">
          <div
            className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-silver-400">
          <span>Completed Milestones: <strong className="text-white">{teamVolume?.completedMilestones || 0}</strong> ({ (teamVolume?.completedMilestones || 0) * 10000 } USD unlocked)</span>
          <span className="font-bold text-gold-300">{progressPercent}% to next \$10,000 Reward</span>
        </div>
      </div>

      {/* Milestones History Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <h3 className="text-base font-bold text-white mb-4">Milestone Rewards Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Reward ID</th>
                <th className="p-3.5">Milestone Level</th>
                <th className="p-3.5">Team Volume Threshold</th>
                <th className="p-3.5">Reward Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Unlocked Date</th>
                <th className="p-3.5">Paid Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {rewards.map(rwd => (
                <tr key={rwd.id} className="hover:bg-obsidian-850/60 transition-all">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{rwd.id}</td>
                  <td className="p-3.5 font-bold text-white">Milestone #{rwd.milestoneIndex}</td>
                  <td className="p-3.5 font-mono text-silver-300">${rwd.threshold.toLocaleString()}</td>
                  <td className="p-3.5 font-mono font-extrabold text-amber-400 text-sm">${rwd.rewardAmount.toLocaleString()}</td>
                  <td className="p-3.5">
                    {rwd.status === 'PAID' && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Paid & Credited
                      </span>
                    )}
                    {rwd.status === 'UNLOCKED' && (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <Sparkles className="w-3 h-3" /> Unlocked (Pending Admin Issue)
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-silver-400">{new Date(rwd.createdAt).toLocaleString()}</td>
                  <td className="p-3.5 text-silver-400">{rwd.paidAt ? new Date(rwd.paidAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
              {rewards.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-silver-500">
                    No milestone reward unlocked yet. Reach \$50,000 team investment volume to unlock your first \$10,000 reward.
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
