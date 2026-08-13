'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockStore } from '@/lib/data/mockStore';
import { User, Investment, DepositRecord, WithdrawalRecord, MilestoneReward, AuditLog } from '@/types';
import {
  ShieldAlert,
  Wallet,
  TrendingUp,
  Users,
  Award,
  ArrowDownCircle,
  ArrowUpCircle,
  PlayCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Activity,
  FileText,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [rewards, setRewards] = useState<MilestoneReward[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const refreshData = () => {
    setUsers(mockStore.getAllUsers());
    setInvestments(mockStore.getInvestments());
    setDeposits(mockStore.getDeposits());
    setWithdrawals(mockStore.getWithdrawals());
    setRewards(mockStore.getRewards());
    setAuditLogs(mockStore.getAuditLogs());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalApprovedCapital = investments
    .filter(i => i.status === 'APPROVED')
    .reduce((sum, i) => sum + i.approvedAmount, 0);

  const pendingDepositsCount = deposits.filter(d => d.status === 'PENDING').length;
  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'PENDING').length;
  const pendingRewardsCount = rewards.filter(r => r.status === 'UNLOCKED').length;

  const totalUsersCount = users.filter(u => u.role === 'USER').length;
  const level1QualifiedCount = users.filter(u => u.level1Qualified).length;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Banner */}
      <div className="glass-panel-gold rounded-2xl p-6 border border-gold-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Administrator Control Center (SRS §7)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Platform System & Financial Overview</h1>
          <p className="text-sm text-silver-300 mt-1">
            Manage deposit approvals, withdrawal payouts, Level-1 qualifications, daily profit cron jobs, and financial audits.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/cron-control"
            className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
          >
            <PlayCircle className="w-4 h-4" /> Run Profit Cron Job
          </Link>
          <Link
            href="/admin/deposits"
            className="bg-obsidian-800 hover:bg-obsidian-750 text-silver-200 border border-obsidian-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" /> Pending Deposits ({pendingDepositsCount})
          </Link>
        </div>
      </div>

      {/* Financial Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Approved Capital */}
        <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-silver-400 uppercase tracking-wider">Total Approved Capital</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">${totalApprovedCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <p className="text-xs text-silver-400 mt-1">Active Trading Base</p>
          </div>
        </div>

        {/* Pending Payout Liabilities */}
        <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-silver-400 uppercase tracking-wider">Pending Withdrawals</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-400">{pendingWithdrawalsCount} Requests</h3>
            <p className="text-xs text-silver-400 mt-1">Awaiting Admin Verification</p>
          </div>
        </div>

        {/* Level-1 Qualified Sponsors */}
        <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-silver-400 uppercase tracking-wider">L1 Qualified Sponsors</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{level1QualifiedCount} / {totalUsersCount} Investors</h3>
            <p className="text-xs text-silver-400 mt-1">Earning 40% Gen-1 Bonus</p>
          </div>
        </div>

        {/* Pending Reward Milestones */}
        <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-silver-400 uppercase tracking-wider">Unlocked \$10k Rewards</span>
            <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gold-400">{pendingRewardsCount} Unlocked</h3>
            <p className="text-xs text-silver-400 mt-1">Ready for Approval</p>
          </div>
        </div>
      </div>

      {/* Quick Action Control Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/deposits"
          className="glass-panel rounded-2xl p-6 border border-obsidian-750 hover:border-gold-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <ArrowDownCircle className="w-6 h-6" />
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded font-bold">
                {pendingDepositsCount} Action Needed
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors">Deposit Management</h3>
            <p className="text-xs text-silver-400 mt-1">Review proof of payment and approve investments.</p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-gold-400">
            <span>Manage Deposits</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/withdrawals"
          className="glass-panel rounded-2xl p-6 border border-obsidian-750 hover:border-gold-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <ArrowUpCircle className="w-6 h-6" />
              </div>
              <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-0.5 rounded font-bold">
                {pendingWithdrawalsCount} Action Needed
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors">Withdrawal Management</h3>
            <p className="text-xs text-silver-400 mt-1">Verify 3% fees and authorize payout transactions.</p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-gold-400">
            <span>Manage Withdrawals</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/cron-control"
          className="glass-panel rounded-2xl p-6 border border-obsidian-750 hover:border-gold-500/40 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gold-500/20 text-gold-400 rounded-xl">
                <PlayCircle className="w-6 h-6" />
              </div>
              <span className="bg-gold-500/20 text-gold-300 text-xs px-2.5 py-0.5 rounded font-bold">0.60% Engine</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors">Profit Cron Simulator</h3>
            <p className="text-xs text-silver-400 mt-1">Simulate daily profit crediting & commission calculation.</p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-gold-400">
            <span>Open Controller</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* System Audit Log Preview */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-gold-400" /> Recent Privileged Admin Actions
          </h3>
          <Link href="/admin/audit-logs" className="text-xs text-gold-400 hover:underline font-semibold">
            View All Audit Logs
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Audit ID</th>
                <th className="p-3.5">Admin Email</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Entity</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {auditLogs.slice(0, 5).map(log => (
                <tr key={log.id} className="hover:bg-obsidian-850/60">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{log.id}</td>
                  <td className="p-3.5 text-silver-300 font-semibold">{log.adminEmail}</td>
                  <td className="p-3.5 font-bold text-white">
                    <span className="bg-obsidian-800 text-gold-300 border border-gold-500/30 px-2 py-0.5 rounded text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-silver-400">{log.entity} #{log.entityId}</td>
                  <td className="p-3.5 text-silver-400">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
