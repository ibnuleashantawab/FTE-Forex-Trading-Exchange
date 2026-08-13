'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { User } from '@/types';
import { Share2, Copy, Check, QrCode, ShieldCheck, Info, Sparkles } from 'lucide-react';

export default function ReferralLinkPage() {
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUser(mockStore.getActiveUser());
  }, []);

  if (!user) return null;

  const referralUrl = `https://fte.com/register?ref=${user.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel-gold rounded-2xl p-6 border border-gold-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_25px_rgba(212,175,55,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Generation-1 Direct Sponsorship Model (SRS §4)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Referral Sharing Center</h1>
          <p className="text-sm text-silver-300 mt-1">
            Share your personal referral URL to sponsor new investors and earn 40% daily trading income generation commissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral URL & Code Box */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-gold-400" /> Your Personal Referral Link & Code
            </h3>
            <p className="text-xs text-silver-400 mb-6">
              When new investors register using your link, they are permanently attached to your Generation-1 network.
            </p>

            <div className="flex flex-col gap-5">
              {/* Code */}
              <div className="bg-obsidian-850 border border-gold-500/30 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-silver-400 font-bold uppercase tracking-wider">Referral Code</span>
                  <p className="text-2xl font-mono font-black text-gold-400 tracking-wider">{user.referralCode}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.referralCode);
                    alert('Referral Code copied!');
                  }}
                  className="bg-obsidian-750 hover:bg-gold-500/20 text-gold-300 border border-obsidian-600 hover:border-gold-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-bold text-silver-300 uppercase tracking-wider mb-2">
                  Complete Invitation URL
                </label>
                <div className="flex items-center gap-2 bg-obsidian-850 p-2.5 rounded-xl border border-obsidian-700">
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    className="bg-transparent text-sm text-white font-mono w-full focus:outline-none px-2"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-extrabold px-5 py-2.5 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-obsidian-750 text-xs text-silver-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Permanent Sponsor Protection
            </span>
            <span className="text-gold-300 font-semibold">Self-referral & circular sponsorship strictly prevented</span>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 mb-4">
            <QrCode className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Scan QR Code to Join</h3>
          <p className="text-xs text-silver-400 mb-6 max-w-xs">
            Show this QR code to prospective investors for instant smartphone scanning and registration.
          </p>

          {/* Render Stylized SVG QR Code Placeholder */}
          <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-gold-500 mb-4">
            <svg width="140" height="140" viewBox="0 0 100 100" fill="#0b0e14">
              <rect x="5" y="5" width="30" height="30" rx="4" fill="#0b0e14" />
              <rect x="10" y="10" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="14" y="14" width="12" height="12" fill="#0b0e14" />

              <rect x="65" y="5" width="30" height="30" rx="4" fill="#0b0e14" />
              <rect x="70" y="10" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="74" y="14" width="12" height="12" fill="#0b0e14" />

              <rect x="5" y="65" width="30" height="30" rx="4" fill="#0b0e14" />
              <rect x="10" y="70" width="20" height="20" rx="2" fill="#ffffff" />
              <rect x="14" y="74" width="12" height="12" fill="#0b0e14" />

              <rect x="42" y="10" width="16" height="10" />
              <rect x="42" y="26" width="10" height="16" />
              <rect x="10" y="42" width="16" height="10" />
              <rect x="30" y="42" width="10" height="16" />
              <rect x="46" y="46" width="20" height="20" fill="#d4af37" />
              <rect x="72" y="42" width="18" height="10" />
              <rect x="72" y="60" width="18" height="16" />
              <rect x="42" y="72" width="16" height="18" />
              <rect x="65" y="80" width="20" height="10" />
            </svg>
          </div>
          <span className="text-[11px] font-mono text-gold-300 font-bold">{user.referralCode}</span>
        </div>
      </div>
    </div>
  );
}
