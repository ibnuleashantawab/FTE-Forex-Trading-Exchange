'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { WithdrawalRecord } from '@/types';
import { ArrowUpCircle, CheckCircle2, XCircle, Clock, ShieldCheck, DollarSign } from 'lucide-react';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);

  const refreshData = () => {
    setWithdrawals(mockStore.getWithdrawals());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleApprove = (wthId: string) => {
    const txHash = prompt('Enter payout transaction reference / blockchain tx hash:', `OUT-TRC20-${Date.now()}`);
    if (txHash !== null) {
      try {
        mockStore.approveWithdrawal(wthId, 'admin-1', txHash);
        alert('Withdrawal marked as COMPLETED!');
        refreshData();
      } catch (err: any) {
        alert(err.message || 'Failed to approve withdrawal.');
      }
    }
  };

  const handleReject = (wthId: string) => {
    const reason = prompt('Enter rejection reason (user funds will be refunded):', 'Invalid payout wallet address');
    if (reason !== null) {
      try {
        mockStore.rejectWithdrawal(wthId, 'admin-1', reason);
        alert('Withdrawal rejected and user balance refunded.');
        refreshData();
      } catch (err: any) {
        alert(err.message || 'Failed to reject withdrawal.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <ArrowUpCircle className="w-3.5 h-3.5" /> Withdrawal Payout Governance (SRS §7.4)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Withdrawals Management Desk</h1>
          <p className="text-sm text-silver-400 mt-1">
            Verify payout destination wallet addresses, verify 3% fee deductions, and authorize payouts.
          </p>
        </div>
      </div>

      {/* Withdrawals Ledger Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Withdrawal ID</th>
                <th className="p-3.5">User ID</th>
                <th className="p-3.5">Source Wallet</th>
                <th className="p-3.5">Requested Amount</th>
                <th className="p-3.5">Fee (3%)</th>
                <th className="p-3.5">Net Payout</th>
                <th className="p-3.5">Payout Address</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {withdrawals.map(wth => (
                <tr key={wth.id} className="hover:bg-obsidian-850/60 transition-all">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{wth.id}</td>
                  <td className="p-3.5 font-mono text-silver-300">{wth.userId}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${wth.walletType === 'PROFIT_WALLET' ? 'bg-gold-500/10 text-gold-300 border border-gold-500/30' : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'}`}>
                      {wth.walletType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-white">${wth.requestedAmount.toFixed(2)}</td>
                  <td className="p-3.5 font-mono text-amber-400">${wth.fee.toFixed(2)}</td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-400">${wth.netPayout.toFixed(2)}</td>
                  <td className="p-3.5 font-mono text-xs text-silver-200 font-bold break-all select-all">{wth.payoutMethod}: {wth.payoutDetails}</td>
                  <td className="p-3.5">
                    {wth.status === 'COMPLETED' && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                    {wth.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                    {wth.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    {wth.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(wth.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Authorize Payout
                        </button>
                        <button
                          onClick={() => handleReject(wth.id)}
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
              {withdrawals.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-silver-500">
                    No withdrawal requests to manage.
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
