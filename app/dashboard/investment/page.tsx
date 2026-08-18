'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockStore } from '@/lib/data/mockStore';
import { User, Investment } from '@/types';
import { Wallet, ShieldCheck, ArrowRight, PlusCircle, CheckCircle2, Clock, XCircle, Info } from 'lucide-react';
import { CONSTANTS, calculateDepositCharge } from '@/lib/services/financialEngine';

export default function MyInvestmentPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [amountInput, setAmountInput] = useState<string>('500');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const refreshData = () => {
    const active = mockStore.getActiveUser();
    setUser(active);
    if (active) {
      setInvestments(mockStore.getInvestments(active.id));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!user) return null;

  const numAmount = parseFloat(amountInput) || 0;
  let chargeCalc = { grossAmount: 0, fee: 0, netAmount: 0 };
  let isValidAmount = numAmount >= CONSTANTS.MIN_INVESTMENT && numAmount <= CONSTANTS.MAX_INVESTMENT;

  if (isValidAmount) {
    try {
      chargeCalc = calculateDepositCharge(numAmount);
    } catch (e) {
      isValidAmount = false;
    }
  }

  const totalApprovedCapital = investments
    .filter(i => i.status === 'APPROVED')
    .reduce((sum, i) => sum + i.approvedAmount, 0);

  const handleCreateInvestmentRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isValidAmount) {
      setErrorMsg(`Investment amount must be between $${CONSTANTS.MIN_INVESTMENT} and $${CONSTANTS.MAX_INVESTMENT.toLocaleString()}.`);
      return;
    }

    // Automatically navigate user to deposit form with selected upgrade amount
    router.push(`/dashboard/deposit?amount=${numAmount}&isUpgrade=true`);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Immutable Financial Records (SRS §6.2)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">My Investment Portfolio</h1>
          <p className="text-sm text-silver-400 mt-1">
            Minimum investment: \$50. Maximum investment: \$50,000. Daily trading profit: 0.60% Mon–Fri.
          </p>
        </div>

        <div className="bg-obsidian-850 border border-gold-500/30 px-6 py-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-gold-500/20 text-gold-400 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gold-300 font-bold uppercase tracking-wider">Total Eligible Capital</p>
            <p className="text-2xl font-black text-white">${totalApprovedCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Upgrade / New Investment Form & Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <PlusCircle className="w-5 h-5 text-gold-400" /> Investment Capital Upgrade Form
            </h3>
            <p className="text-xs text-silver-400 mb-6">
              Select or enter your new investment capital. Upgrades immediately add to your eligible capital base upon approval.
            </p>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateInvestmentRequest} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                  Investment Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gold-400 font-extrabold text-base">$</span>
                  <input
                    type="number"
                    min={CONSTANTS.MIN_INVESTMENT}
                    max={CONSTANTS.MAX_INVESTMENT}
                    step="10"
                    value={amountInput}
                    onChange={e => setAmountInput(e.target.value)}
                    className="w-full bg-obsidian-850 border border-obsidian-700 focus:border-gold-500 text-white font-mono text-lg font-bold pl-8 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                    placeholder="Enter amount ($50 - $50,000)"
                  />
                </div>
              </div>

              {/* Quick Amount Selector Buttons */}
              <div className="flex flex-wrap gap-2">
                {[50, 250, 500, 1000, 2500, 5000, 10000, 50000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountInput(amt.toString())}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      numAmount === amt
                        ? 'bg-gold-500 text-obsidian-950 shadow-md'
                        : 'bg-obsidian-800 hover:bg-obsidian-750 text-silver-300 border border-obsidian-700'
                    }`}
                  >
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* 3% Fee & Net Calculation Breakdown (SRS Section 8.2) */}
              <div className="bg-obsidian-850 border border-gold-500/20 p-4 rounded-xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-silver-400">
                  <span>Gross Investment Request:</span>
                  <span className="font-mono text-white font-bold">${chargeCalc.grossAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-silver-400">
                  <span className="flex items-center gap-1">
                    Deposit Charge (3% Fee): <Info className="w-3.5 h-3.5 text-silver-500" />
                  </span>
                  <span className="font-mono text-amber-400 font-bold">-\${chargeCalc.fee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-obsidian-750 flex items-center justify-between text-sm font-extrabold">
                  <span className="text-gold-300">Net Credited Trading Capital:</span>
                  <span className="font-mono text-emerald-400 text-base">\${chargeCalc.netAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValidAmount}
                className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-obsidian-950 font-black py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 text-base"
              >
                Submit Investment Upgrade Request <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Investment Policy Side Card */}
        <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-gold-400" /> Business & Financial Rules
            </h3>
            <ul className="flex flex-col gap-3 text-xs text-silver-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Investment Limits:</strong> Minimum investment is \$50; maximum allowed per account is \$50,000.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Deposit Charge:</strong> A 3% charge is deducted from gross deposit requests upon admin verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Daily Trading Income:</strong> Eligible capital generates 0.60% profit on trading days (Monday to Friday).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Level-1 Eligibility:</strong> Maintaining $\ge \$500$ approved investment qualifies you toward Level-1 sponsor status.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Immutable Investment Records Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <h3 className="text-base font-bold text-white mb-4">Investment History Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Record ID</th>
                <th className="p-3.5">Gross Amount</th>
                <th className="p-3.5">Fee (3%)</th>
                <th className="p-3.5">Net Approved Capital</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Requested Date</th>
                <th className="p-3.5">Approved Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {investments.map(inv => (
                <tr key={inv.id} className="hover:bg-obsidian-850/60 transition-all">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{inv.id}</td>
                  <td className="p-3.5 font-mono font-bold text-white">${inv.amount.toFixed(2)}</td>
                  <td className="p-3.5 font-mono text-amber-400">${inv.charge.toFixed(2)}</td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-400">${inv.approvedAmount.toFixed(2)}</td>
                  <td className="p-3.5">
                    {inv.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    )}
                    {inv.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                    {inv.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-silver-400">{new Date(inv.createdAt).toLocaleString()}</td>
                  <td className="p-3.5 text-silver-400">{inv.approvedAt ? new Date(inv.approvedAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
              {investments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-silver-500">
                    No investment records found.
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
