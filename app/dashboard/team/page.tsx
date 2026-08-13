'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { User, Investment } from '@/types';
import { Users, ShieldCheck, CheckCircle2, XCircle, AlertCircle, Award, Share2, ArrowRight } from 'lucide-react';
import { checkLevel1Eligibility } from '@/lib/services/financialEngine';

export default function MyTeamPage() {
  const [user, setUser] = useState<User | null>(null);
  const [directRefs, setDirectRefs] = useState<User[]>([]);
  const [teamVolume, setTeamVolume] = useState<any>(null);
  const [level1Audit, setLevel1Audit] = useState<any>(null);

  const refreshData = () => {
    const active = mockStore.getActiveUser();
    setUser(active);
    if (active) {
      const refs = mockStore.getDirectReferrals(active.id);
      setDirectRefs(refs);
      const invs = mockStore.getInvestments(active.id);
      const audit = checkLevel1Eligibility(active, invs, refs);
      setLevel1Audit(audit);
      const tv = mockStore.getTeamVolume(active.id);
      setTeamVolume(tv);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" /> Direct Referral & Team Volume Management (SRS §4)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">My Team & Referral Network</h1>
          <p className="text-sm text-silver-400 mt-1">
            Build your direct referral team to unlock Level-1 40% daily generation commission and \$10,000 milestone rewards.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-obsidian-850 border border-obsidian-750 px-5 py-3 rounded-xl">
            <p className="text-[10px] text-silver-400 font-bold uppercase tracking-wider">Direct Referrals</p>
            <p className="text-2xl font-black text-white">{directRefs.length} Members</p>
          </div>
          <div className="bg-obsidian-850 border border-gold-500/30 px-5 py-3 rounded-xl">
            <p className="text-[10px] text-gold-300 font-bold uppercase tracking-wider">Team Investment Volume</p>
            <p className="text-2xl font-black text-gold-400">${teamVolume?.totalTeamVolume.toLocaleString() || '0'}</p>
          </div>
        </div>
      </div>

      {/* Level-1 Qualification Audit Card */}
      {level1Audit && (
        <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${level1Audit.isQualified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Level-1 Qualification Audit Checklist
                  {level1Audit.isQualified ? (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase">
                      Qualified
                    </span>
                  ) : (
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase">
                      Action Required
                    </span>
                  )}
                </h3>
                <p className="text-xs text-silver-400">Reevaluated automatically upon investment or referral changes.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Condition 1 */}
            <div className={`p-4 rounded-xl border ${level1Audit.ownCapitalQualified ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-obsidian-850 border-obsidian-750'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-silver-300">Rule 1: Own Capital</span>
                {level1Audit.ownCapitalQualified ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-silver-400">Must hold $\ge \$500$ approved personal investment.</p>
              <p className={`text-sm font-extrabold mt-2 ${level1Audit.ownCapitalQualified ? 'text-emerald-400' : 'text-amber-400'}`}>
                Current: ${level1Audit.ownCapital.toLocaleString()} / $500
              </p>
            </div>

            {/* Condition 2 */}
            <div className={`p-4 rounded-xl border ${level1Audit.referralsCountQualified ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-obsidian-850 border-obsidian-750'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-silver-300">Rule 2: Direct Referral Count</span>
                {level1Audit.referralsCountQualified ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-silver-400">Must sponsor at least 4 direct referrals.</p>
              <p className={`text-sm font-extrabold mt-2 ${level1Audit.referralsCountQualified ? 'text-emerald-400' : 'text-amber-400'}`}>
                Current: {directRefs.length} / 4 Members
              </p>
            </div>

            {/* Condition 3 */}
            <div className={`p-4 rounded-xl border ${level1Audit.referralsCountQualified ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-obsidian-850 border-obsidian-750'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-silver-300">Rule 3: Referral Capital Threshold</span>
                {level1Audit.referralsCountQualified ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-silver-400">Each of 4 direct referrals must hold $\ge \$500$ investment.</p>
              <p className={`text-sm font-extrabold mt-2 ${level1Audit.referralsCountQualified ? 'text-emerald-400' : 'text-amber-400'}`}>
                Qualified Directs: {level1Audit.qualifiedReferralsCount} / 4
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Direct Referrals Network Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Direct First-Generation Members</h3>
          <span className="text-xs text-silver-400">Direct Sponsor ID: <code className="text-gold-300">{user.id}</code></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Member Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Sponsor Code</th>
                <th className="p-3.5">Total Approved Capital</th>
                <th className="p-3.5">L1 Qualification Contributor ($\ge \$500$)</th>
                <th className="p-3.5">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {directRefs.map(ref => {
                const isContrib = ref.totalInvested >= 500;
                return (
                  <tr key={ref.id} className="hover:bg-obsidian-850/60 transition-all">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold text-xs border border-gold-500/30">
                        {ref.name.charAt(0)}
                      </div>
                      {ref.name}
                    </td>
                    <td className="p-3.5 text-silver-400">{ref.email}</td>
                    <td className="p-3.5 font-mono text-gold-300">{ref.referralCode}</td>
                    <td className="p-3.5 font-mono font-extrabold text-emerald-400 text-sm">
                      ${ref.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5">
                      {isContrib ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Contributor ($\ge \$500$)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          <AlertCircle className="w-3 h-3" /> Below \$500 Threshold
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-silver-400">{new Date(ref.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
              {directRefs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-silver-500">
                    No direct referrals registered yet. Share your referral link to build your team.
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
