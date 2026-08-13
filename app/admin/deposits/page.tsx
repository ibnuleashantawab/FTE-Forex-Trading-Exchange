'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { DepositRecord } from '@/types';
import { ArrowDownCircle, CheckCircle2, XCircle, Clock, ExternalLink, ShieldCheck, Eye } from 'lucide-react';

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);

  const refreshData = () => {
    setDeposits(mockStore.getDeposits());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleApprove = (depId: string) => {
    if (confirm('Approve this deposit request? Net investment capital will be credited to user balance.')) {
      try {
        mockStore.approveDeposit(depId);
        alert('Deposit approved and credited successfully!');
        refreshData();
      } catch (err: any) {
        alert(err.message || 'Failed to approve deposit.');
      }
    }
  };

  const handleReject = (depId: string) => {
    const reason = prompt('Enter rejection reason:', 'Unverified blockchain reference hash');
    if (reason !== null) {
      try {
        mockStore.rejectDeposit(depId, 'admin-1', reason);
        alert('Deposit request rejected.');
        refreshData();
      } catch (err: any) {
        alert(err.message || 'Failed to reject deposit.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <ArrowDownCircle className="w-3.5 h-3.5" /> Deposit Approval & Verification Hub (SRS §7.3)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Deposit Requests Management</h1>
          <p className="text-sm text-silver-400 mt-1">
            Review proof of payment reference, verify 3% deposit charges, and approve investments.
          </p>
        </div>
      </div>

      {/* Deposit Requests Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Deposit ID</th>
                <th className="p-3.5">User ID</th>
                <th className="p-3.5">Gross Amount</th>
                <th className="p-3.5">3% Fee</th>
                <th className="p-3.5">Net Credited</th>
                <th className="p-3.5">Gateway Method</th>
                <th className="p-3.5">Reference Hash</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {deposits.map(dep => (
                <tr key={dep.id} className="hover:bg-obsidian-850/60 transition-all">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{dep.id}</td>
                  <td className="p-3.5 font-mono text-silver-300">{dep.userId}</td>
                  <td className="p-3.5 font-mono font-bold text-white">${dep.grossAmount.toFixed(2)}</td>
                  <td className="p-3.5 font-mono text-amber-400">${dep.fee.toFixed(2)}</td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-400">${dep.netAmount.toFixed(2)}</td>
                  <td className="p-3.5 font-mono text-silver-300">{dep.method}</td>
                  <td className="p-3.5 font-mono text-xs text-silver-400 max-w-[150px] truncate">{dep.referenceNumber}</td>
                  <td className="p-3.5">
                    {dep.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    )}
                    {dep.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                    {dep.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    {dep.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(dep.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(dep.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 font-bold"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-silver-500 text-xs font-mono">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
              {deposits.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-silver-500">
                    No deposit requests to manage.
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
