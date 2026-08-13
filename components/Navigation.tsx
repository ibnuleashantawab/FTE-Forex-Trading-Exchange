'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FteLogo } from '@/components/FteLogo';
import { mockStore } from '@/lib/data/mockStore';
import { User } from '@/types';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Users,
  Share2,
  Gift,
  Award,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  HelpCircle,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Clock,
  LogOut,
  ChevronRight,
  Menu,
  X,
  PlayCircle,
  Zap,
  Repeat,
  RotateCcw,
} from 'lucide-react';

export const Navigation = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMode, setRoleMode] = useState<'USER' | 'ADMIN'>('USER');

  const refreshUser = () => {
    const active = mockStore.getActiveUser();
    setUser(active);
    setRoleMode(active.role);
  };

  useEffect(() => {
    refreshUser();
    // Subscribe to periodic storage checks or route changes
    const interval = setInterval(refreshUser, 1000);
    return () => clearInterval(interval);
  }, [pathname]);

  const toggleRole = () => {
    if (roleMode === 'USER') {
      mockStore.setActiveUserId('admin-1');
      setRoleMode('ADMIN');
      router.push('/admin/dashboard');
    } else {
      mockStore.setActiveUserId('user-1');
      setRoleMode('USER');
      router.push('/dashboard');
    }
    refreshUser();
  };

  const handleResetData = () => {
    if (confirm('Reset demo store data back to initial SRS seed values?')) {
      mockStore.resetStore();
      refreshUser();
      router.push('/dashboard');
    }
  };

  // 11 User Navigation Items according to SRS Section 5
  const userNavItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Investment', href: '/dashboard/investment', icon: Wallet },
    { name: 'Trading Profit', href: '/dashboard/trading-profit', icon: TrendingUp },
    { name: 'My Team', href: '/dashboard/team', icon: Users },
    { name: 'Referral Link', href: '/dashboard/referral', icon: Share2 },
    { name: 'Generation Bonus', href: '/dashboard/generation-bonus', icon: Gift },
    { name: 'Rewards', href: '/dashboard/rewards', icon: Award },
    { name: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownCircle },
    { name: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpCircle },
    { name: 'Transaction History', href: '/dashboard/transactions', icon: History },
    { name: 'Support Center', href: '/dashboard/support', icon: HelpCircle },
  ];

  // Admin Navigation Items according to SRS Section 7
  const adminNavItems = [
    { name: 'Admin Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Deposit Approvals', href: '/admin/deposits', icon: ArrowDownCircle },
    { name: 'Withdrawal Approvals', href: '/admin/withdrawals', icon: ArrowUpCircle },
    { name: 'Rewards & Commissions', href: '/admin/rewards', icon: Award },
    { name: 'Profit Cron Control', href: '/admin/cron-control', icon: PlayCircle },
    { name: 'Support Desk', href: '/admin/support', icon: HelpCircle },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
  ];

  const currentNavItems = roleMode === 'ADMIN' ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-obsidian-950 text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-obsidian-900 border-r border-obsidian-750 p-4 sticky top-0 h-screen z-30 justify-between">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="py-2 border-b border-obsidian-750 pb-4">
            <FteLogo size="md" />
          </div>

          {/* User Role Switcher Banner */}
          <div className="bg-obsidian-800 border border-gold-500/20 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${roleMode === 'ADMIN' ? 'bg-amber-500/20 text-amber-400' : 'bg-gold-500/20 text-gold-400'}`}>
                {roleMode === 'ADMIN' ? <ShieldAlert className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs text-silver-400 font-medium">Active Mode</p>
                <p className="text-sm font-bold text-gray-100">{roleMode === 'ADMIN' ? 'Administrator' : 'Investor'}</p>
              </div>
            </div>
            <button
              onClick={toggleRole}
              className="text-xs bg-obsidian-700 hover:bg-gold-500/20 hover:text-gold-300 text-silver-300 border border-obsidian-600 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 font-semibold"
              title="Switch between Investor & Admin role view"
            >
              <Repeat className="w-3 h-3" />
              Switch
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-1">
              {roleMode === 'ADMIN' ? 'Admin Controls' : 'User Portal'}
            </p>
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 text-gold-300 border border-gold-500/30 font-semibold shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                      : 'text-silver-400 hover:text-gray-100 hover:bg-obsidian-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-silver-500'}`} />
                  <span>{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-gold-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Demo Controls */}
        <div className="pt-4 border-t border-obsidian-750 flex flex-col gap-3">
          {user && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian-850 border border-obsidian-750">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center font-bold text-obsidian-950 text-sm shadow-md">
                  {user.name.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-gray-200 truncate">{user.name}</p>
                  <p className="text-[10px] text-silver-400 truncate">{user.email}</p>
                </div>
              </div>
              {user.level1Qualified && (
                <span className="bg-gold-500/20 border border-gold-500/40 text-gold-300 text-[10px] px-1.5 py-0.5 rounded font-semibold" title="Level-1 Qualified Sponsor">
                  L1
                </span>
              )}
            </div>
          )}

          <button
            onClick={handleResetData}
            className="w-full text-xs bg-obsidian-800 hover:bg-red-500/10 hover:text-red-400 text-silver-400 border border-obsidian-700 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Seed Data
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between bg-obsidian-900 border-b border-obsidian-750 px-4 py-3 sticky top-0 z-40">
        <FteLogo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRole}
            className="text-xs bg-gold-500/20 text-gold-300 border border-gold-500/30 px-2 py-1 rounded font-semibold flex items-center gap-1"
          >
            <Repeat className="w-3 h-3" />
            {roleMode}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg bg-obsidian-800 text-silver-300 border border-obsidian-700"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-obsidian-950/95 backdrop-blur-md p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-obsidian-750 mb-6">
              <FteLogo size="md" />
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                      isActive ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-silver-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-obsidian-750 flex flex-col gap-3">
            <button
              onClick={() => {
                toggleRole();
                setMobileOpen(false);
              }}
              className="w-full py-3 bg-gold-500 text-obsidian-950 font-bold rounded-xl flex items-center justify-center gap-2"
            >
              Switch to {roleMode === 'USER' ? 'Admin Portal' : 'Investor Portal'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Balance Strip for Investors */}
        {roleMode === 'USER' && user && (
          <header className="bg-obsidian-900/80 backdrop-blur border-b border-obsidian-750 px-6 py-3.5 hidden md:flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  Welcome back, {user.name}
                  {user.level1Qualified && (
                    <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 text-[11px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Zap className="w-3 h-3 fill-obsidian-950" /> Level-1 Qualified
                    </span>
                  )}
                </h2>
                <p className="text-xs text-silver-400">Sponsor Code: <code className="text-gold-300 font-mono">{user.referralCode}</code></p>
              </div>
            </div>

            {/* Wallet Balances Quick Bar */}
            <div className="flex items-center gap-4">
              <div className="bg-obsidian-850 border border-obsidian-750 px-4 py-1.5 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-silver-400 font-semibold uppercase tracking-wider">Main Capital</p>
                  <p className="text-sm font-extrabold text-white">${user.mainBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="bg-obsidian-850 border border-gold-500/30 px-4 py-1.5 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(212,175,55,0.08)]">
                <div className="p-2 bg-gold-500/20 rounded-lg text-gold-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gold-300 font-semibold uppercase tracking-wider">Available Profit</p>
                  <p className="text-sm font-extrabold text-gold-400">${user.profitBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-2">
                <Link
                  href="/dashboard/deposit"
                  className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5" /> Deposit
                </Link>
                <Link
                  href="/dashboard/withdraw"
                  className="bg-obsidian-800 hover:bg-obsidian-700 text-silver-200 border border-obsidian-700 px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                >
                  <ArrowUpCircle className="w-3.5 h-3.5 text-gold-400" /> Withdraw
                </Link>
              </div>
            </div>
          </header>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
