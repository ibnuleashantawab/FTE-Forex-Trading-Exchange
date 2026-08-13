'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { User, DepositRecord, DepositMethod } from '@/types';
import { ArrowDownCircle, CheckCircle2, Clock, XCircle, Info, Copy, Upload, ShieldCheck } from 'lucide-react';
import { CONSTANTS, calculateDepositCharge } from '@/lib/services/financialEngine';

export default function DepositPage() {
  const [user, setUser] = useState<User | null>(null);
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);

  const [grossInput, setGrossInput] = useState<string>('1000');
  const [method, setMethod] = useState<DepositMethod>('USDT_TRC20');
  const [refNumber, setRefNumber] = useState<string>('');
  const [proofUrl, setProofUrl] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const refreshData = () => {
    const active = mockStore.getActiveUser();
    setUser(active);
    if (active) {
      setDeposits(mockStore.getDeposits(active.id));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!user) return null;

  const numGross = parseFloat(grossInput) || 0;
  let chargeCalc = { grossAmount: 0, fee: 0, netAmount: 0 };
  let isValid = numGross >= CONSTANTS.MIN_INVESTMENT && numGross <= CONSTANTS.MAX_INVESTMENT;

  if (isValid) {
    try {
      chargeCalc = calculateDepositCharge(numGross);
    } catch {
      isValid = false;
    }
  }

  const paymentWallets: Record<DepositMethod, { name: string; address: string; qrPlaceholder: string }> = {
    USDT_TRC20: {
      name: 'USDT (Tron TRC20)',
      address: 'T9xK1mQzWpL8R4vY7aJ2eC5hB0nS9uV3xP',
      qrPlaceholder: 'TRC20-ADDRESS',
    },
    USDT_ERC20: {
      name: 'USDT (Ethereum ERC20)',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      qrPlaceholder: 'ERC20-ADDRESS',
    },
    BTC: {
      name: 'Bitcoin (BTC Network)',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      qrPlaceholder: 'BTC-ADDRESS',
    },
    BANK_TRANSFER: {
      name: 'SWIFT / Bank Wire Transfer',
      address: 'FTE Global Forex Clearing Ltd | Account: 9988112233 | Routing: 121000358',
      qrPlaceholder: 'BANK-WIRE',
    },
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isValid) {
      setErrorMsg(`Deposit amount must be between $${CONSTANTS.MIN_INVESTMENT} and $${CONSTANTS.MAX_INVESTMENT.toLocaleString()}.`);
      return;
    }

    if (!refNumber.trim()) {
      setErrorMsg('Please enter the payment transaction hash or reference number.');
      return;
    }

    try {
      mockStore.createDeposit(
        user.id,
        numGross,
        method,
        refNumber,
        proofUrl || 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=60'
      );
      setSuccessMsg(`Deposit request of $${numGross.toLocaleString()} submitted! Admin verification pending.`);
      setGrossInput('1000');
      setRefNumber('');
      setProofUrl('');
      refreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit deposit request.');
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <ArrowDownCircle className="w-3.5 h-3.5" /> 3% Deposit Charge Policy (SRS §6.4 & §8.2)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Deposit Capital Portal</h1>
          <p className="text-sm text-silver-400 mt-1">
            Deposit requests are processed 7 days a week. All deposits require admin approval before becoming active capital.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposit Request Form */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ArrowDownCircle className="w-5 h-5 text-gold-400" /> New Deposit Request Form
            </h3>
            <p className="text-xs text-silver-400 mb-6">
              Enter gross deposit amount and select your payment method. Charge (3%) will be calculated transparently.
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

            <form onSubmit={handleDepositSubmit} className="flex flex-col gap-5">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                  Select Payment Gateway / Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['USDT_TRC20', 'USDT_ERC20', 'BTC', 'BANK_TRANSFER'] as DepositMethod[]).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
                        method === m
                          ? 'bg-gold-500/20 border-gold-500 text-gold-300 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                          : 'bg-obsidian-850 hover:bg-obsidian-800 border-obsidian-700 text-silver-400'
                      }`}
                    >
                      <span>{paymentWallets[m].name.split(' ')[0]}</span>
                      <span className="text-[10px] text-silver-500 font-mono mt-1">{m.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                  Gross Deposit Amount ($USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gold-400 font-extrabold text-base">$</span>
                  <input
                    type="number"
                    min={CONSTANTS.MIN_INVESTMENT}
                    max={CONSTANTS.MAX_INVESTMENT}
                    step="10"
                    value={grossInput}
                    onChange={e => setGrossInput(e.target.value)}
                    className="w-full bg-obsidian-850 border border-obsidian-700 focus:border-gold-500 text-white font-mono text-lg font-bold pl-8 pr-4 py-3 rounded-xl focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Fee Breakdown Card */}
              <div className="bg-obsidian-850 border border-gold-500/30 p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-silver-400">
                  <span>Gross Deposit Amount:</span>
                  <span className="font-mono text-white font-bold">${chargeCalc.grossAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-silver-400">
                  <span>3% Deposit Fee:</span>
                  <span className="font-mono text-amber-400 font-bold">-\${chargeCalc.fee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-obsidian-750 flex items-center justify-between text-sm font-extrabold">
                  <span className="text-gold-300">Net Investment Capital Credited:</span>
                  <span className="font-mono text-emerald-400 text-base">\${chargeCalc.netAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Reference & Proof Inputs */}
              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                  Payment Reference / Blockchain Tx Hash
                </label>
                <input
                  type="text"
                  required
                  value={refNumber}
                  onChange={e => setRefNumber(e.target.value)}
                  placeholder="e.g. TX-TRC20-9988776655"
                  className="w-full bg-obsidian-850 border border-obsidian-700 focus:border-gold-500 text-white font-mono text-sm px-4 py-3 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                  Proof Image URL / Screenshot (Optional)
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={e => setProofUrl(e.target.value)}
                  placeholder="https://... (screenshot link)"
                  className="w-full bg-obsidian-850 border border-obsidian-700 focus:border-gold-500 text-white font-mono text-xs px-4 py-3 rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-obsidian-950 font-black py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] text-base"
              >
                Submit Deposit Request For Verification
              </button>
            </form>
          </div>
        </div>

        {/* Deposit Gateway Address Display Card */}
        <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-400" /> Gateway Wallet Address
            </h3>
            <p className="text-xs text-silver-400 mb-4">
              Send exact payment amount to the official FTE wallet address below:
            </p>

            <div className="bg-obsidian-850 border border-gold-500/30 p-4 rounded-xl flex flex-col gap-3">
              <span className="text-[10px] text-gold-300 font-bold uppercase tracking-wider">
                {paymentWallets[method].name}
              </span>
              <p className="text-xs font-mono font-bold text-white break-all bg-obsidian-900 p-2.5 rounded-lg border border-obsidian-750">
                {paymentWallets[method].address}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentWallets[method].address);
                  alert('Gateway wallet address copied to clipboard!');
                }}
                className="w-full bg-obsidian-800 hover:bg-gold-500/20 text-gold-300 border border-obsidian-700 hover:border-gold-500/40 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Gateway Address
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-obsidian-750 text-[11px] text-silver-400 leading-relaxed">
            <p className="flex items-center gap-1 text-gold-300 font-semibold mb-1">
              <Info className="w-3.5 h-3.5" /> Verification Notice:
            </p>
            Deposits are verified against blockchain explorers or banking ledgers by administrators. Approved deposits immediately credit your net investment capital.
          </div>
        </div>
      </div>

      {/* Deposit Requests History Ledger Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <h3 className="text-base font-bold text-white mb-4">Deposit Requests Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Deposit ID</th>
                <th className="p-3.5">Gross Amount</th>
                <th className="p-3.5">3% Fee</th>
                <th className="p-3.5">Net Credited</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Reference Hash</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Submitted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {deposits.map(dep => (
                <tr key={dep.id} className="hover:bg-obsidian-850/60 transition-all">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{dep.id}</td>
                  <td className="p-3.5 font-mono font-bold text-white">${dep.grossAmount.toFixed(2)}</td>
                  <td className="p-3.5 font-mono text-amber-400">${dep.fee.toFixed(2)}</td>
                  <td className="p-3.5 font-mono font-extrabold text-emerald-400">${dep.netAmount.toFixed(2)}</td>
                  <td className="p-3.5 font-mono text-silver-300">{dep.method}</td>
                  <td className="p-3.5 font-mono text-xs text-silver-400 truncate max-w-[150px]">{dep.referenceNumber}</td>
                  <td className="p-3.5">
                    {dep.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    )}
                    {dep.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <Clock className="w-3 h-3" /> Verifying
                      </span>
                    )}
                    {dep.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <XCircle className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-silver-400">{new Date(dep.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {deposits.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-silver-500">
                    No deposit requests submitted yet.
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
