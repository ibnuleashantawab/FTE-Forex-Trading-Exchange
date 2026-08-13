'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { MilestoneReward, CommissionRecord } from '@/types';
import { Award, Gift, CheckCircle2, Sparkles, ShieldCheck, DollarSign } from 'lucide-react';

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<MilestoneReward[]>([]);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);

  const refreshData = () => {
    setRewards(mockStore.getRewards());
    setCommissions(mockStore.getCommissions());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleApproveReward = (rwdId: string) => {
    if (confirm('Approve and issue this $10,000 milestone reward to user profit balance?')) {
      try {
        mockStore.approveReward(rwdId, 'admin-1');
        alert('$10,000 reward approved and credited!');
        refreshData();
      } catch (err: any) {
        alert(err.message || 'Failed to approve reward.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel-gold rounded-2xl p-6 border border-gold-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_25px_rgba(212,175,55,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" /> Commission & Milestone Reward Governance (SRS §7.5 & §7.6)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Rewards & Commissions Desk</h1>
          <p className="text-sm text-silver-300 mt-1">
            Review \$50,000 team volume milestones, authorize \$10,000 milestone reward payouts, and inspect 40% Gen-1 commissions.
          </p>
        </div>
      </div>

      {/* Milestone Rewards Audit Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-gold-400" /> Team Milestone Rewards ($10,000 Per $50k Team Volume)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Reward ID</th>
                <th className="p-3.5">User ID</th>
                <th className="p-3.5">Milestone Index</th>
                <th className="p-3.5">Team Volume Threshold</th>
                <th className="p-3.5">Reward Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Unlocked Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {rewards.map(rwd => (
                <tr key={rwd.id} className="hover:bg-obsidian-850/60 transition-all">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{rwd.id}</td>
                  <td className="p-3.5 font-mono text-silver-300">{rwd.userId}</td>
                  <td className="p-3.5 font-bold text-white">Milestone #{rwd.milestoneIndex}</td>
                  <td className="p-3.5 font-mono text-silver-300">${rwd.threshold.toLocaleString()}</td>
                  <td className="p-3.5 font-mono font-extrabold text-amber-400 text-sm">${rwd.rewardAmount.toLocaleString()}</td>
                  <td className="p-3.5">
                    {rwd.status === 'PAID' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Paid & Credited
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <Sparkles className="w-3 h-3" /> Unlocked (Action Needed)
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-silver-400">{new Date(rwd.createdAt).toLocaleString()}</td>
                  <td className="p-3.5 text-right">
                    {rwd.status === 'UNLOCKED' ? (
                      <button
                        onClick={() => handleApproveReward(rwd.id)}
                        className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-extrabold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm flex items-center gap-1 ml-auto"
                      >
                        <Award className="w-3.5 h-3.5" /> Approve $10,000 Reward
                      </button>
                    ) : (
                      <span className="text-silver-500 text-xs font-mono">Issued</span>
                    )}
                  </td>
                </tr>
              ))}
              {rewards.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-silver-500">
                    No milestone rewards unlocked yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generation-1 Commissions Audit Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-400" /> First-Generation Commissions Audit Log (40%)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Commission ID</th>
                <th className="p-3.5">Sponsor ID</th>
                <th className="p-3.5">Source Member</th>
                <th className="p-3.5">Member Daily Profit</th>
                <th className="p-3.5">Rate (40%)</th>
                <th className="p-3.5">Commission Payout</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {commissions.map(c => (
                <tr key={c.id} className="hover:bg-obsidian-850/60 transition-all">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{c.id}</td>
                  <td className="p-3.5 font-mono text-silver-300">{c.sponsorId}</td>
                  <td className="p-3.5 font-bold text-white">{c.sourceMemberName}</td>
                  <td className="p-3.5 font-mono text-silver-300">${c.sourceProfitAmount.toFixed(2)}</td>
                  <td className="p-3.5 font-mono font-bold text-gold-400">40.0%</td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-400">${c.amount.toFixed(2)}</td>
                  <td className="p-3.5 font-mono text-xs text-emerald-400">{c.status}</td>
                  <td className="p-3.5 text-silver-400">{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
