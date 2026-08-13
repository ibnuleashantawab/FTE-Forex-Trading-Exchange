'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { User, WithdrawalRecord, WalletType, DepositMethod } from '@/types';
import { ArrowUpCircle, Wallet, TrendingUp, CheckCircle2, Clock, XCircle, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { calculateWithdrawalCharge } from '@/lib/services/financialEngine';

export default function WithdrawPage() {
  const [user, setUser] = useState<User | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);

  const [walletType, setWalletType] = useState<WalletType>('PROFIT_WALLET');
  const [requestedAmount, setRequestedAmount] = useState<string>('100');
  const [payoutMethod, setPayoutMethod] = useState<DepositMethod>('USDT_TRC20');
  const [payoutDetails, setPayoutDetails] = useState<string>('T9xK1mQzWpL8R4vY7aJ2eC5hB0nS');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const refreshData = () => {
    const active = mockStore.getActiveUser();
    setUser(active);
    if (active) {
      setWithdrawals(mockStore.getWithdrawals(active.id));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!user) return null;

  const numAmount = parseFloat(requestedAmount) || 0;
  let chargeCalc = { requestedAmount: 0, fee: 0, netPayout: 0 };
  let isValid = numAmount >= 10;

  if (isValid) {
    try {
      chargeCalc = calculateWithdrawalCharge(numAmount);
    } catch {
      isValid = false;
    }
  }

  const availableBalance = walletType === 'PROFIT_WALLET' ? user.profitBalance : user.mainBalance;
  const isBalanceSufficient = availableBalance >= numAmount;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (numAmount < 10) {
      setErrorMsg('Minimum withdrawal amount is $10.00.');
      return;
    }

    if (!isBalanceSufficient) {
      setErrorMsg(`Insufficient balance in ${walletType === 'PROFIT_WALLET' ? 'Profit Wallet' : 'Main Capital Wallet'}. Available: $${availableBalance.toFixed(2)}`);
      return;
    }

    if (!payoutDetails.trim()) {
      setErrorMsg('Please enter your payout destination wallet address or bank details.');
      return;
    }

    try {
      mockStore.createWithdrawal(user.id, walletType, numAmount, payoutMethod, payoutDetails);
      setSuccessMsg(`Withdrawal request of $${numAmount.toFixed(2)} submitted! Net Payout: $${chargeCalc.netPayout.toFixed(2)}`);
      setRequestedAmount('100');
      refreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process withdrawal request.');
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <ArrowUpCircle className="w-3.5 h-3.5" /> 3% Withdrawal Charge & Separate Wallet Policy (SRS §6.5 & §8.3)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Withdrawal Portal</h1>
          <p className="text-sm text-silver-400 mt-1">
            Profit Withdrawal and Main Capital Withdrawal options operate independently. A 3% charge applies to all requested payouts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal Form */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-gold-400" /> Withdrawal Request Form
            </h3>
            <p className="text-xs text-silver-400 mb-6">
              Select source wallet, enter withdrawal amount, and verify your payout destination address.
            </p>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl mb-4">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl mb-4">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="flex flex-col gap-5">
              {/* Separate Wallet Option Selector (SRS Section 6.5 Requirement) */}
              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                  Select Source Wallet
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWalletType('PROFIT_WALLET')}
                    className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                      walletType === 'PROFIT_WALLET'
                        ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'bg-obsidian-850 hover:bg-obsidian-800 border-obsidian-700 text-silver-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Profit Wallet</span>
                      <TrendingUp className="w-4 h-4 text-gold-400" />
                    </div>
                    <p className="text-lg font-black text-white mt-2">${user.profitBalance.toFixed(2)}</p>
                    <span className="text-[10px] text-silver-400 mt-1">Daily trading & commission earnings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWalletType('MAIN_BALANCE_WALLET')}
                    className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                      walletType === 'MAIN_BALANCE_WALLET'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-obsidian-850 hover:bg-obsidian-800 border-obsidian-700 text-silver-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Main Capital Wallet</span>
                      <Wallet className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-lg font-black text-white mt-2">${user.mainBalance.toFixed(2)}</p>
                    <span className="text-[10px] text-silver-400 mt-1">Principal investment balance</span>
                  </button>
                </div>
              </div>

              {/* Requested Amount Input */}
              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                  Requested Withdrawal Amount ($USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gold-400 font-extrabold text-base">$</span>
                  <input
                    type="number"
                    min="10"
                    step="1"
                    value={requestedAmount}
                    onChange={e => setRequestedAmount(e.target.value)}
                    className="w-full bg-obsidian-850 border border-obsidian-700 focus:border-gold-500 text-white font-mono text-lg font-bold pl-8 pr-4 py-3 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* 3% Fee Breakdown Card (SRS Section 8.3) */}
              <div className="bg-obsidian-850 border border-gold-500/30 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-silver-400">
                  <span>Requested Withdrawal Amount:</span>
                  <span className="font-mono text-white font-bold">${chargeCalc.requestedAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-silver-400">
                  <span>Withdrawal Charge (3% Fee):</span>
                  <span className="font-mono text-amber-400 font-bold">-\${chargeCalc.fee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-obsidian-750 flex items-center justify-between text-sm font-extrabold">
                  <span className="text-gold-300">Net Payout to Your Wallet:</span>
                  <span className="font-mono text-emerald-400 text-base">\${chargeCalc.netPayout.toFixed(2)}</span>
                </div>
              </div>

              {/* Payout Gateway & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                    Payout Crypto / Method
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={e => setPayoutMethod(e.target.value as DepositMethod)}
                    className="w-full bg-obsidian-850 border border-obsidian-700 text-white text-xs font-bold px-3 py-3 rounded-xl focus:outline-none"
                  >
                    <option value="USDT_TRC20">USDT (Tron TRC20)</option>
                    <option value="USDT_ERC20">USDT (Ethereum ERC20)</option>
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="BANK_TRANSFER">Bank Wire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                    Payout Destination Address
                  </label>
                  <input
                    type="text"
                    required
                    value={payoutDetails}
                    onChange={e => setPayoutDetails(e.target.value)}
                    placeholder="Enter wallet address or IBAN"
                    className="w-full bg-obsidian-850 border border-obsidian-700 focus:border-gold-500 text-white font-mono text-xs px-3 py-3 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid || !isBalanceSufficient}
                className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-obsidian-950 font-black py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] text-base"
              >
                Submit Withdrawal Request
              </button>
            </form>
          </div>
        </div>

        {/* Withdrawal Policy Card */}
        <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-400" /> Withdrawal Policy Notice
            </h3>
            <ul className="flex flex-col gap-3 text-xs text-silver-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Wallet Separation:</strong> Profit withdrawal and Main Capital withdrawal are separate flows and tracked independently.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>3% Charge:</strong> Net payout is calculated as requested amount minus 3% withdrawal charge.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span><strong>Lifecycle States:</strong> PENDING $\rightarrow$ REVIEW $\rightarrow$ APPROVED $\rightarrow$ COMPLETED / REJECTED.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Withdrawal History Ledger Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <h3 className="text-base font-bold text-white mb-4">Withdrawal Requests Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Withdrawal ID</th>
                <th className="p-3.5">Wallet Source</th>
                <th className="p-3.5">Requested Amount</th>
                <th className="p-3.5">Fee (3%)</th>
                <th className="p-3.5">Net Payout</th>
                <th className="p-3.5">Payout Method & Address</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {withdrawals.map(wth => (
                <tr key={wth.id} className="hover:bg-obsidian-850/60 transition-all">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{wth.id}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${wth.walletType === 'PROFIT_WALLET' ? 'bg-gold-500/10 text-gold-300 border border-gold-500/30' : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'}`}>
                      {wth.walletType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-white">${wth.requestedAmount.toFixed(2)}</td>
                  <td className="p-3.5 font-mono text-amber-400">${wth.fee.toFixed(2)}</td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-400">${wth.netPayout.toFixed(2)}</td>
                  <td className="p-3.5 font-mono text-xs text-silver-400 max-w-[180px] truncate">
                    {wth.payoutMethod}: {wth.payoutDetails}
                  </td>
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
                  <td className="p-3.5 text-silver-400">{new Date(wth.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {withdrawals.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-silver-500">
                    No withdrawal records found.
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
