'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { User, Investment } from '@/types';
import { Users, Search, ShieldCheck, CheckCircle2, AlertCircle, Lock, Unlock, Eye, RefreshCw } from 'lucide-react';
import { checkLevel1Eligibility } from '@/lib/services/financialEngine';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const refreshData = () => {
    setUsers(mockStore.getAllUsers());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleToggleUserStatus = (u: User) => {
    const newStatus = u.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    if (confirm(`Change user ${u.name}'s status to ${newStatus}?`)) {
      u.status = newStatus;
      refreshData();
    }
  };

  const handleReevaluateLevel1 = (u: User) => {
    const isQual = mockStore.evaluateAndSetLevel1Status(u.id);
    alert(`Reevaluated Level-1 qualification for ${u.name}: ${isQual ? 'QUALIFIED' : 'NOT QUALIFIED'}`);
    refreshData();
  };

  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.referralCode.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" /> User & Referral Governance (SRS §7.2)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">User & Level-1 Management</h1>
          <p className="text-sm text-silver-400 mt-1">
            Search accounts, inspect referral relationships, toggle account freezing, and trigger Level-1 qualification audits.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-silver-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, code..."
            className="w-full bg-obsidian-850 border border-obsidian-750 focus:border-gold-500 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl focus:outline-none"
          />
        </div>
      </div>

      {/* Users Ledger Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Referral Code</th>
                <th className="p-3.5">Sponsor ID</th>
                <th className="p-3.5">Total Invested</th>
                <th className="p-3.5">Level-1 Qualified</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {filteredUsers.map(u => {
                const userInvs = mockStore.getInvestments(u.id);
                const userRefs = mockStore.getDirectReferrals(u.id);
                const l1Audit = checkLevel1Eligibility(u, userInvs, userRefs);

                return (
                  <tr key={u.id} className="hover:bg-obsidian-850/60 transition-all">
                    <td className="p-3.5 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gold-500/20 text-gold-300 font-bold flex items-center justify-center text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{u.name}</p>
                          <p className="text-[10px] text-silver-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-obsidian-800 text-silver-300 border border-obsidian-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-gold-300 font-bold">{u.referralCode}</td>
                    <td className="p-3.5 font-mono text-silver-400">{u.sponsorId || 'None (Direct)'}</td>
                    <td className="p-3.5 font-mono font-extrabold text-emerald-400">${u.totalInvested.toLocaleString()}</td>
                    <td className="p-3.5">
                      {u.level1Qualified ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Qualified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          <AlertCircle className="w-3 h-3" /> Pending ({l1Audit.qualifiedReferralsCount}/4 Refs)
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleReevaluateLevel1(u)}
                        className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-gold-500/20 text-gold-300 border border-obsidian-700 text-xs font-semibold"
                        title="Reevaluate Level-1 Qualification"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleUserStatus(u)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold ${
                          u.status === 'ACTIVE' ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                        title={u.status === 'ACTIVE' ? 'Freeze User Account' : 'Unfreeze User Account'}
                      >
                        {u.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
