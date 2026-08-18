import {
  User,
  Investment,
  TradingProfit,
  ReferralRelation,
  CommissionRecord,
  TeamVolume,
  MilestoneReward,
  DepositRecord,
  WithdrawalRecord,
  SupportTicket,
  SupportMessage,
  AuditLog,
} from '@/types';
import {
  calculateDepositCharge,
  calculateWithdrawalCharge,
  checkLevel1Eligibility,
  calculateDailyProfit,
  calculateGen1Commission,
  calculateMilestonesUnlocked,
  CONSTANTS,
} from '@/lib/services/financialEngine';

// Initial Mock Seed Data
const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'alex.investor@fte.com',
    phone: '+1 555 019 2831',
    role: 'USER',
    sponsorId: null,
    referralCode: 'FTE-ALEX-99',
    level1Qualified: true,
    level1QualifiedAt: '2026-06-15T10:00:00Z',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: '2026-01-10T08:00:00Z',
    mainBalance: 2450.0,
    profitBalance: 680.0,
    totalInvested: 1500.0,
    totalProfitEarned: 420.0,
    totalCommissionEarned: 260.0,
    totalRewardsEarned: 0,
  },
  {
    id: 'ref-1',
    name: 'Sarah Connor',
    email: 'sarah.c@fte.com',
    phone: '+1 555 012 3456',
    role: 'USER',
    sponsorId: 'user-1',
    referralCode: 'FTE-SARAH-01',
    level1Qualified: false,
    level1QualifiedAt: null,
    status: 'ACTIVE',
    twoFactorEnabled: false,
    createdAt: '2026-02-01T11:30:00Z',
    mainBalance: 500.0,
    profitBalance: 120.0,
    totalInvested: 1000.0,
    totalProfitEarned: 120.0,
    totalCommissionEarned: 0,
    totalRewardsEarned: 0,
  },
  {
    id: 'ref-2',
    name: 'David Miller',
    email: 'david.m@fte.com',
    phone: '+1 555 014 9876',
    role: 'USER',
    sponsorId: 'user-1',
    referralCode: 'FTE-DAVID-02',
    level1Qualified: false,
    level1QualifiedAt: null,
    status: 'ACTIVE',
    twoFactorEnabled: false,
    createdAt: '2026-02-15T14:20:00Z',
    mainBalance: 250.0,
    profitBalance: 90.0,
    totalInvested: 750.0,
    totalProfitEarned: 90.0,
    totalCommissionEarned: 0,
    totalRewardsEarned: 0,
  },
  {
    id: 'ref-3',
    name: 'Elena Rostova',
    email: 'elena.r@fte.com',
    phone: '+1 555 018 7766',
    role: 'USER',
    sponsorId: 'user-1',
    referralCode: 'FTE-ELENA-03',
    level1Qualified: false,
    level1QualifiedAt: null,
    status: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: '2026-03-01T09:10:00Z',
    mainBalance: 100.0,
    profitBalance: 60.0,
    totalInvested: 500.0,
    totalProfitEarned: 60.0,
    totalCommissionEarned: 0,
    totalRewardsEarned: 0,
  },
  {
    id: 'ref-4',
    name: 'James Bond',
    email: 'james.007@fte.com',
    phone: '+1 555 007 0007',
    role: 'USER',
    sponsorId: 'user-1',
    referralCode: 'FTE-BOND-04',
    level1Qualified: false,
    level1QualifiedAt: null,
    status: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: '2026-03-10T16:00:00Z',
    mainBalance: 400.0,
    profitBalance: 72.0,
    totalInvested: 600.0,
    totalProfitEarned: 72.0,
    totalCommissionEarned: 0,
    totalRewardsEarned: 0,
  },
  {
    id: 'ref-5',
    name: 'Bruce Wayne',
    email: 'bruce@gotham.com',
    phone: '+1 555 099 8811',
    role: 'USER',
    sponsorId: 'user-1',
    referralCode: 'FTE-WAYNE-05',
    level1Qualified: false,
    level1QualifiedAt: null,
    status: 'ACTIVE',
    twoFactorEnabled: false,
    createdAt: '2026-04-01T12:00:00Z',
    mainBalance: 50.0,
    profitBalance: 15.0,
    totalInvested: 250.0, // Below $500 threshold
    totalProfitEarned: 15.0,
    totalCommissionEarned: 0,
    totalRewardsEarned: 0,
  },
  {
    id: 'admin-1',
    name: 'System Administrator',
    email: 'admin@fte.com',
    phone: '+1 800 555 0100',
    role: 'ADMIN',
    sponsorId: null,
    referralCode: 'FTE-ADMIN-MASTER',
    level1Qualified: false,
    level1QualifiedAt: null,
    status: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: '2026-01-01T00:00:00Z',
    mainBalance: 0,
    profitBalance: 0,
    totalInvested: 0,
    totalProfitEarned: 0,
    totalCommissionEarned: 0,
    totalRewardsEarned: 0,
  },
];

const INITIAL_INVESTMENTS: Investment[] = [
  {
    id: 'inv-101',
    userId: 'user-1',
    amount: 1500.0,
    charge: 45.0,
    approvedAmount: 1455.0,
    status: 'APPROVED',
    createdAt: '2026-01-15T10:00:00Z',
    approvedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'inv-102',
    userId: 'ref-1',
    amount: 1000.0,
    charge: 30.0,
    approvedAmount: 970.0,
    status: 'APPROVED',
    createdAt: '2026-02-02T11:00:00Z',
    approvedAt: '2026-02-02T11:15:00Z',
  },
  {
    id: 'inv-103',
    userId: 'ref-2',
    amount: 750.0,
    charge: 22.5,
    approvedAmount: 727.5,
    status: 'APPROVED',
    createdAt: '2026-02-16T09:00:00Z',
    approvedAt: '2026-02-16T09:20:00Z',
  },
  {
    id: 'inv-104',
    userId: 'ref-3',
    amount: 500.0,
    charge: 15.0,
    approvedAmount: 485.0,
    status: 'APPROVED',
    createdAt: '2026-03-02T14:00:00Z',
    approvedAt: '2026-03-02T14:10:00Z',
  },
  {
    id: 'inv-105',
    userId: 'ref-4',
    amount: 600.0,
    charge: 18.0,
    approvedAmount: 582.0,
    status: 'APPROVED',
    createdAt: '2026-03-12T15:00:00Z',
    approvedAt: '2026-03-12T15:30:00Z',
  },
  {
    id: 'inv-106',
    userId: 'ref-5',
    amount: 250.0,
    charge: 7.5,
    approvedAmount: 242.5,
    status: 'APPROVED',
    createdAt: '2026-04-02T10:00:00Z',
    approvedAt: '2026-04-02T10:15:00Z',
  },
];

const INITIAL_TRADING_PROFITS: TradingProfit[] = [
  {
    id: 'tp-501',
    userId: 'user-1',
    investmentReferenceId: 'inv-101',
    date: '2026-08-10',
    rate: 0.006,
    eligibleCapital: 1455.0,
    amount: 8.73,
    status: 'CREDITED',
    createdAt: '2026-08-10T18:00:00Z',
  },
  {
    id: 'tp-502',
    userId: 'user-1',
    investmentReferenceId: 'inv-101',
    date: '2026-08-11',
    rate: 0.006,
    eligibleCapital: 1455.0,
    amount: 8.73,
    status: 'CREDITED',
    createdAt: '2026-08-11T18:00:00Z',
  },
  {
    id: 'tp-503',
    userId: 'ref-1',
    investmentReferenceId: 'inv-102',
    date: '2026-08-11',
    rate: 0.006,
    eligibleCapital: 970.0,
    amount: 5.82,
    status: 'CREDITED',
    createdAt: '2026-08-11T18:00:00Z',
  },
  {
    id: 'tp-504',
    userId: 'ref-2',
    investmentReferenceId: 'inv-103',
    date: '2026-08-11',
    rate: 0.006,
    eligibleCapital: 727.5,
    amount: 4.37,
    status: 'CREDITED',
    createdAt: '2026-08-11T18:00:00Z',
  },
];

const INITIAL_COMMISSIONS: CommissionRecord[] = [
  {
    id: 'comm-801',
    sponsorId: 'user-1',
    sourceMemberId: 'ref-1',
    sourceMemberName: 'Sarah Connor',
    sourceProfitId: 'tp-503',
    sourceProfitAmount: 5.82,
    generation: 1,
    rate: 0.4,
    amount: 2.33,
    status: 'PAID',
    createdAt: '2026-08-11T18:05:00Z',
  },
  {
    id: 'comm-802',
    sponsorId: 'user-1',
    sourceMemberId: 'ref-2',
    sourceMemberName: 'David Miller',
    sourceProfitId: 'tp-504',
    sourceProfitAmount: 4.37,
    generation: 1,
    rate: 0.4,
    amount: 1.75,
    status: 'PAID',
    createdAt: '2026-08-11T18:05:00Z',
  },
];

const INITIAL_DEPOSITS: DepositRecord[] = [
  {
    id: 'dep-901',
    userId: 'user-1',
    grossAmount: 1500.0,
    fee: 45.0,
    netAmount: 1455.0,
    method: 'USDT_TRC20',
    referenceNumber: 'TX-TRC20-9988112233',
    proofUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=60',
    status: 'APPROVED',
    createdAt: '2026-01-15T09:30:00Z',
    processedAt: '2026-01-15T10:00:00Z',
    adminNotes: 'Verified on TronScan blockchain explorer',
  },
  {
    id: 'dep-902',
    userId: 'user-1',
    grossAmount: 1000.0,
    fee: 30.0,
    netAmount: 970.0,
    method: 'USDT_TRC20',
    referenceNumber: 'TX-TRC20-7766554411',
    proofUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=60',
    status: 'PENDING',
    createdAt: '2026-08-13T14:20:00Z',
  },
];

const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: 'wth-301',
    userId: 'user-1',
    walletType: 'PROFIT_WALLET',
    requestedAmount: 200.0,
    fee: 6.0,
    netPayout: 194.0,
    payoutMethod: 'USDT_TRC20',
    payoutDetails: 'T9xK1mQzWpL8R4vY7aJ2eC5hB0nS',
    status: 'COMPLETED',
    payoutReference: 'OUT-TX-TRC20-55443322',
    createdAt: '2026-08-01T12:00:00Z',
    updatedAt: '2026-08-01T15:30:00Z',
    adminNotes: 'Processed via automated hot wallet release',
  },
  {
    id: 'wth-302',
    userId: 'user-1',
    walletType: 'PROFIT_WALLET',
    requestedAmount: 100.0,
    fee: 3.0,
    netPayout: 97.0,
    payoutMethod: 'USDT_TRC20',
    payoutDetails: 'T9xK1mQzWpL8R4vY7aJ2eC5hB0nS',
    status: 'PENDING',
    createdAt: '2026-08-13T18:00:00Z',
  },
];

const INITIAL_REWARDS: MilestoneReward[] = [];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-001',
    userId: 'user-1',
    userName: 'Alex Morgan',
    userEmail: 'alex.investor@fte.com',
    subject: 'Deposit Verification Inquiry for $1,000 USDT',
    category: 'DEPOSIT',
    transactionReference: 'TX-TRC20-7766554411',
    status: 'IN_PROGRESS',
    createdAt: '2026-08-13T15:00:00Z',
    updatedAt: '2026-08-13T16:30:00Z',
  },
];

const INITIAL_MESSAGES: SupportMessage[] = [
  {
    id: 'msg-001',
    ticketId: 'tkt-001',
    senderId: 'user-1',
    senderName: 'Alex Morgan',
    senderRole: 'USER',
    message: 'Hello Support, I submitted a deposit request for $1,000 USDT TRC20 earlier today. Could you check the transaction status?',
    createdAt: '2026-08-13T15:00:00Z',
  },
  {
    id: 'msg-002',
    ticketId: 'tkt-001',
    senderId: 'admin-1',
    senderName: 'System Administrator',
    senderRole: 'ADMIN',
    message: 'Hi Alex, our finance department is verifying the blockchain confirmation. We will approve it shortly.',
    createdAt: '2026-08-13T16:30:00Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    adminId: 'admin-1',
    adminEmail: 'admin@fte.com',
    action: 'APPROVE_DEPOSIT',
    entity: 'DepositRecord',
    entityId: 'dep-901',
    beforeSnapshot: { status: 'PENDING' },
    afterSnapshot: { status: 'APPROVED', netAmount: 1455.0 },
    ipAddress: '192.168.1.100',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'audit-002',
    adminId: 'admin-1',
    adminEmail: 'admin@fte.com',
    action: 'EVALUATE_LEVEL1_QUALIFICATION',
    entity: 'User',
    entityId: 'user-1',
    beforeSnapshot: { level1Qualified: false },
    afterSnapshot: { level1Qualified: true, reason: '4 direct referrals with >= $500 investment' },
    ipAddress: '192.168.1.100',
    createdAt: '2026-06-15T10:00:00Z',
  },
];

// Helper to safely load state from localStorage or fallback
class StoreManager {
  private users: User[] = INITIAL_USERS;
  private investments: Investment[] = INITIAL_INVESTMENTS;
  private tradingProfits: TradingProfit[] = INITIAL_TRADING_PROFITS;
  private commissions: CommissionRecord[] = INITIAL_COMMISSIONS;
  private deposits: DepositRecord[] = INITIAL_DEPOSITS;
  private withdrawals: WithdrawalRecord[] = INITIAL_WITHDRAWALS;
  private rewards: MilestoneReward[] = INITIAL_REWARDS;
  private tickets: SupportTicket[] = INITIAL_TICKETS;
  private messages: SupportMessage[] = INITIAL_MESSAGES;
  private auditLogs: AuditLog[] = INITIAL_AUDIT_LOGS;

  private activeUserId: string = 'user-1'; // Default logged in user

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const storedUsers = localStorage.getItem('fte_users');
      if (storedUsers) this.users = JSON.parse(storedUsers);

      const storedInv = localStorage.getItem('fte_investments');
      if (storedInv) this.investments = JSON.parse(storedInv);

      const storedProf = localStorage.getItem('fte_profits');
      if (storedProf) this.tradingProfits = JSON.parse(storedProf);

      const storedComm = localStorage.getItem('fte_commissions');
      if (storedComm) this.commissions = JSON.parse(storedComm);

      const storedDep = localStorage.getItem('fte_deposits');
      if (storedDep) this.deposits = JSON.parse(storedDep);

      const storedWth = localStorage.getItem('fte_withdrawals');
      if (storedWth) this.withdrawals = JSON.parse(storedWth);

      const storedRwd = localStorage.getItem('fte_rewards');
      if (storedRwd) this.rewards = JSON.parse(storedRwd);

      const storedTkt = localStorage.getItem('fte_tickets');
      if (storedTkt) this.tickets = JSON.parse(storedTkt);

      const storedMsg = localStorage.getItem('fte_messages');
      if (storedMsg) this.messages = JSON.parse(storedMsg);

      const storedAudit = localStorage.getItem('fte_audit');
      if (storedAudit) this.auditLogs = JSON.parse(storedAudit);

      const storedActiveUser = localStorage.getItem('fte_active_user_id');
      if (storedActiveUser) this.activeUserId = storedActiveUser;

      // Sanity Check: Ensure rewards are only present if team volume threshold was actually met, and sync totalRewardsEarned
      this.users.forEach(u => {
        const tv = this.getTeamVolume(u.id);
        this.rewards = this.rewards.filter(r => r.userId !== u.id || r.threshold <= tv.totalTeamVolume);
        const paidSum = this.rewards
          .filter(r => r.userId === u.id && r.status === 'PAID')
          .reduce((sum, r) => sum + r.rewardAmount, 0);
        u.totalRewardsEarned = paidSum;
      });
    } catch (e) {
      console.warn('Failed to parse localStorage, using default seed data.', e);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('fte_users', JSON.stringify(this.users));
      localStorage.setItem('fte_investments', JSON.stringify(this.investments));
      localStorage.setItem('fte_profits', JSON.stringify(this.tradingProfits));
      localStorage.setItem('fte_commissions', JSON.stringify(this.commissions));
      localStorage.setItem('fte_deposits', JSON.stringify(this.deposits));
      localStorage.setItem('fte_withdrawals', JSON.stringify(this.withdrawals));
      localStorage.setItem('fte_rewards', JSON.stringify(this.rewards));
      localStorage.setItem('fte_tickets', JSON.stringify(this.tickets));
      localStorage.setItem('fte_messages', JSON.stringify(this.messages));
      localStorage.setItem('fte_audit', JSON.stringify(this.auditLogs));
      localStorage.setItem('fte_active_user_id', this.activeUserId);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // --- Getters ---
  getActiveUser(): User {
    return this.users.find(u => u.id === this.activeUserId) || this.users[0];
  }

  setActiveUserId(id: string) {
    this.activeUserId = id;
    this.saveToStorage();
  }

  getAllUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getInvestments(userId?: string): Investment[] {
    if (userId) return this.investments.filter(i => i.userId === userId);
    return [...this.investments];
  }

  getTradingProfits(userId?: string): TradingProfit[] {
    if (userId) return this.tradingProfits.filter(tp => tp.userId === userId);
    return [...this.tradingProfits];
  }

  getCommissions(sponsorId?: string): CommissionRecord[] {
    if (sponsorId) return this.commissions.filter(c => c.sponsorId === sponsorId);
    return [...this.commissions];
  }

  getDeposits(userId?: string): DepositRecord[] {
    if (userId) return this.deposits.filter(d => d.userId === userId);
    return [...this.deposits];
  }

  getWithdrawals(userId?: string): WithdrawalRecord[] {
    if (userId) return this.withdrawals.filter(w => w.userId === userId);
    return [...this.withdrawals];
  }

  getRewards(userId?: string): MilestoneReward[] {
    if (userId) return this.rewards.filter(r => r.userId === userId);
    return [...this.rewards];
  }

  getTickets(userId?: string): SupportTicket[] {
    if (userId) return this.tickets.filter(t => t.userId === userId);
    return [...this.tickets];
  }

  getMessages(ticketId: string): SupportMessage[] {
    return this.messages.filter(m => m.ticketId === ticketId);
  }

  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  // --- Team & Referral Calculations ---
  getDirectReferrals(userId: string): User[] {
    return this.users.filter(u => u.sponsorId === userId);
  }

  getTeamVolume(userId: string): TeamVolume {
    const directRefs = this.getDirectReferrals(userId);
    let totalTeamVolume = 0;
    let qualifyingCount = 0;

    directRefs.forEach(ref => {
      totalTeamVolume += ref.totalInvested;
      if (ref.totalInvested >= CONSTANTS.LEVEL1_MIN_REFERRAL_INVESTMENT) {
        qualifyingCount++;
      }
    });

    const completedMilestones = calculateMilestonesUnlocked(totalTeamVolume);
    const nextMilestoneTarget = (completedMilestones + 1) * CONSTANTS.REWARD_MILESTONE_STEP;

    return {
      userId,
      totalTeamVolume,
      qualifyingTeamMembersCount: qualifyingCount,
      completedMilestones,
      nextMilestoneTarget,
      updatedAt: new Date().toISOString(),
    };
  }

  // --- Actions ---

  createDeposit(userId: string, grossAmount: number, method: any, referenceNumber: string, proofUrl?: string): DepositRecord {
    const { fee, netAmount } = calculateDepositCharge(grossAmount);
    const deposit: DepositRecord = {
      id: `dep-${Date.now()}`,
      userId,
      grossAmount,
      fee,
      netAmount,
      method,
      referenceNumber,
      proofUrl,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.deposits.unshift(deposit);
    this.saveToStorage();
    return deposit;
  }

  approveDeposit(depositId: string, adminId: string = 'admin-1'): DepositRecord {
    const deposit = this.deposits.find(d => d.id === depositId);
    if (!deposit) throw new Error('Deposit not found.');
    if (deposit.status === 'APPROVED') throw new Error('Deposit already approved.');

    const beforeState = { ...deposit };
    deposit.status = 'APPROVED';
    deposit.processedAt = new Date().toISOString();

    // Create corresponding Investment
    const investment: Investment = {
      id: `inv-${Date.now()}`,
      userId: deposit.userId,
      amount: deposit.grossAmount,
      charge: deposit.fee,
      approvedAmount: deposit.netAmount,
      status: 'APPROVED',
      createdAt: deposit.createdAt,
      approvedAt: new Date().toISOString(),
    };
    this.investments.unshift(investment);

    // Update User Balance & totalInvested
    const user = this.getUserById(deposit.userId);
    if (user) {
      user.mainBalance += deposit.netAmount;
      user.totalInvested += deposit.grossAmount;
      
      // Auto-evaluate Level-1 Qualification
      this.evaluateAndSetLevel1Status(user.id);

      // Evaluate Team Reward Milestones for sponsor if any
      if (user.sponsorId) {
        this.evaluateTeamMilestones(user.sponsorId);
        this.evaluateAndSetLevel1Status(user.sponsorId);
      }
    }

    // Add Audit Log
    this.addAuditLog(adminId, 'APPROVE_DEPOSIT', 'DepositRecord', deposit.id, beforeState, deposit);

    this.saveToStorage();
    return deposit;
  }

  rejectDeposit(depositId: string, adminId: string = 'admin-1', reason: string = 'Invalid proof'): DepositRecord {
    const deposit = this.deposits.find(d => d.id === depositId);
    if (!deposit) throw new Error('Deposit not found.');
    const beforeState = { ...deposit };
    deposit.status = 'REJECTED';
    deposit.adminNotes = reason;
    deposit.processedAt = new Date().toISOString();

    this.addAuditLog(adminId, 'REJECT_DEPOSIT', 'DepositRecord', deposit.id, beforeState, deposit);
    this.saveToStorage();
    return deposit;
  }

  createWithdrawal(userId: string, walletType: any, requestedAmount: number, payoutMethod: any, payoutDetails: string): WithdrawalRecord {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found.');

    const { fee, netPayout } = calculateWithdrawalCharge(requestedAmount);

    if (walletType === 'PROFIT_WALLET') {
      if (user.profitBalance < requestedAmount) {
        throw new Error(`Insufficient profit balance. Available: $${user.profitBalance.toFixed(2)}`);
      }
      user.profitBalance -= requestedAmount;
    } else {
      if (user.mainBalance < requestedAmount) {
        throw new Error(`Insufficient main balance. Available: $${user.mainBalance.toFixed(2)}`);
      }
      user.mainBalance -= requestedAmount;
    }

    const withdrawal: WithdrawalRecord = {
      id: `wth-${Date.now()}`,
      userId,
      walletType,
      requestedAmount,
      fee,
      netPayout,
      payoutMethod,
      payoutDetails,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.withdrawals.unshift(withdrawal);
    this.saveToStorage();
    return withdrawal;
  }

  approveWithdrawal(withdrawalId: string, adminId: string = 'admin-1', txHash?: string): WithdrawalRecord {
    const withdrawal = this.withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) throw new Error('Withdrawal not found.');
    if (withdrawal.status === 'COMPLETED') throw new Error('Withdrawal already completed.');

    const beforeState = { ...withdrawal };
    withdrawal.status = 'COMPLETED';
    withdrawal.payoutReference = txHash || `TX-OUT-${Date.now()}`;
    withdrawal.updatedAt = new Date().toISOString();

    this.addAuditLog(adminId, 'APPROVE_WITHDRAWAL', 'WithdrawalRecord', withdrawal.id, beforeState, withdrawal);
    this.saveToStorage();
    return withdrawal;
  }

  rejectWithdrawal(withdrawalId: string, adminId: string = 'admin-1', reason: string = 'Invalid wallet details'): WithdrawalRecord {
    const withdrawal = this.withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) throw new Error('Withdrawal not found.');

    const beforeState = { ...withdrawal };
    withdrawal.status = 'REJECTED';
    withdrawal.adminNotes = reason;
    withdrawal.updatedAt = new Date().toISOString();

    // Refund user balance
    const user = this.getUserById(withdrawal.userId);
    if (user) {
      if (withdrawal.walletType === 'PROFIT_WALLET') {
        user.profitBalance += withdrawal.requestedAmount;
      } else {
        user.mainBalance += withdrawal.requestedAmount;
      }
    }

    this.addAuditLog(adminId, 'REJECT_WITHDRAWAL', 'WithdrawalRecord', withdrawal.id, beforeState, withdrawal);
    this.saveToStorage();
    return withdrawal;
  }

  // --- Cron Daily Trading Profit Simulation ---
  runDailyTradingProfitJob(simulatedDate?: string): {
    profitsCredited: number;
    commissionsPaid: number;
    rewardsUnlocked: number;
    profitDetails: { userName: string; email: string; eligibleCapital: number; profitAmount: number }[];
    commissionDetails: { sponsorName: string; sourceMemberName: string; sourceProfitAmount: number; commissionAmount: number }[];
    rewardDetails: { userName: string; milestoneIndex: number; threshold: number; rewardAmount: number }[];
  } {
    const today = simulatedDate || new Date().toISOString().split('T')[0];
    let profitsCreditedCount = 0;
    let commissionsPaidCount = 0;
    let rewardsUnlockedCount = 0;

    const profitDetails: { userName: string; email: string; eligibleCapital: number; profitAmount: number }[] = [];
    const commissionDetails: { sponsorName: string; sourceMemberName: string; sourceProfitAmount: number; commissionAmount: number }[] = [];
    const rewardDetails: { userName: string; milestoneIndex: number; threshold: number; rewardAmount: number }[] = [];

    // Check if already processed for today
    const existingForToday = this.tradingProfits.filter(tp => tp.date === today);
    if (existingForToday.length > 0) {
      console.log(`Trading profit already processed for ${today}`);
    }

    this.users.forEach(user => {
      if (user.role === 'ADMIN') return;
      const userApprovedInvestments = this.investments.filter(i => i.userId === user.id && i.status === 'APPROVED');
      const totalEligibleCapital = userApprovedInvestments.reduce((sum, i) => sum + i.approvedAmount, 0);

      if (totalEligibleCapital <= 0) return;

      const dailyProfitAmount = calculateDailyProfit(totalEligibleCapital);
      if (dailyProfitAmount <= 0) return;

      // Idempotency check per user/date
      const alreadyCredited = this.tradingProfits.find(tp => tp.userId === user.id && tp.date === today);
      if (alreadyCredited) return;

      // 1. Credit User Profit
      const profitRecord: TradingProfit = {
        id: `tp-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        userId: user.id,
        date: today,
        rate: CONSTANTS.DAILY_PROFIT_RATE,
        eligibleCapital: totalEligibleCapital,
        amount: dailyProfitAmount,
        status: 'CREDITED',
        createdAt: new Date().toISOString(),
      };
      this.tradingProfits.unshift(profitRecord);
      user.profitBalance += dailyProfitAmount;
      user.totalProfitEarned += dailyProfitAmount;
      profitsCreditedCount++;

      profitDetails.push({
        userName: user.name,
        email: user.email,
        eligibleCapital: totalEligibleCapital,
        profitAmount: dailyProfitAmount,
      });

      // 2. Check Sponsor Generation-1 Commission
      if (user.sponsorId) {
        const sponsor = this.getUserById(user.sponsorId);
        if (sponsor && sponsor.level1Qualified) {
          const commissionAmount = calculateGen1Commission(dailyProfitAmount);
          if (commissionAmount > 0) {
            const commRecord: CommissionRecord = {
              id: `comm-${Date.now()}-${Math.floor(Math.random()*1000)}`,
              sponsorId: sponsor.id,
              sourceMemberId: user.id,
              sourceMemberName: user.name,
              sourceProfitId: profitRecord.id,
              sourceProfitAmount: dailyProfitAmount,
              generation: 1,
              rate: CONSTANTS.GEN1_COMMISSION_RATE,
              amount: commissionAmount,
              status: 'PAID',
              createdAt: new Date().toISOString(),
            };
            this.commissions.unshift(commRecord);
            sponsor.profitBalance += commissionAmount;
            sponsor.totalCommissionEarned += commissionAmount;
            commissionsPaidCount++;

            commissionDetails.push({
              sponsorName: sponsor.name,
              sourceMemberName: user.name,
              sourceProfitAmount: dailyProfitAmount,
              commissionAmount,
            });
          }
        }
      }
    });

    // Re-evaluate rewards across all users
    this.users.forEach(user => {
      const teamVolume = this.getTeamVolume(user.id);
      const userRewards = this.getRewards(user.id);

      for (let index = 1; index <= teamVolume.completedMilestones; index++) {
        const existing = userRewards.find(r => r.milestoneIndex === index);
        if (!existing) {
          const reward: MilestoneReward = {
            id: `rwd-${Date.now()}-${index}`,
            userId: user.id,
            milestoneIndex: index,
            threshold: index * CONSTANTS.REWARD_MILESTONE_STEP,
            rewardAmount: CONSTANTS.REWARD_MILESTONE_AMOUNT,
            status: 'UNLOCKED',
            createdAt: new Date().toISOString(),
            paidAt: null,
          };
          this.rewards.unshift(reward);
          rewardsUnlockedCount++;

          rewardDetails.push({
            userName: user.name,
            milestoneIndex: index,
            threshold: index * CONSTANTS.REWARD_MILESTONE_STEP,
            rewardAmount: CONSTANTS.REWARD_MILESTONE_AMOUNT,
          });
        }
      }
    });

    this.addAuditLog('admin-1', 'RUN_DAILY_TRADING_PROFIT_JOB', 'TradingProfit', today, null, {
      date: today,
      profitsCreditedCount,
      commissionsPaidCount,
      rewardsUnlockedCount,
    });

    this.saveToStorage();
    return {
      profitsCredited: profitsCreditedCount,
      commissionsPaid: commissionsPaidCount,
      rewardsUnlocked: rewardsUnlockedCount,
      profitDetails,
      commissionDetails,
      rewardDetails,
    };
  }

  // --- Level 1 & Reward Helpers ---
  evaluateAndSetLevel1Status(userId: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;

    const userInv = this.getInvestments(userId);
    const directRefs = this.getDirectReferrals(userId);

    const check = checkLevel1Eligibility(user, userInv, directRefs);
    const wasQualified = user.level1Qualified;

    user.level1Qualified = check.isQualified;
    if (check.isQualified && !wasQualified) {
      user.level1QualifiedAt = new Date().toISOString();
      this.addAuditLog('admin-1', 'LEVEL1_QUALIFICATION_ACHIEVED', 'User', user.id, { wasQualified: false }, { isQualified: true });
    }
    this.saveToStorage();
    return check.isQualified;
  }

  evaluateTeamMilestones(userId: string): number {
    const teamVolume = this.getTeamVolume(userId);
    const user = this.getUserById(userId);
    if (!user) return 0;

    let newlyUnlocked = 0;
    const userRewards = this.getRewards(userId);

    for (let index = 1; index <= teamVolume.completedMilestones; index++) {
      const existing = userRewards.find(r => r.milestoneIndex === index);
      if (!existing) {
        const reward: MilestoneReward = {
          id: `rwd-${Date.now()}-${index}`,
          userId,
          milestoneIndex: index,
          threshold: index * CONSTANTS.REWARD_MILESTONE_STEP,
          rewardAmount: CONSTANTS.REWARD_MILESTONE_AMOUNT,
          status: 'UNLOCKED',
          createdAt: new Date().toISOString(),
          paidAt: null,
        };
        this.rewards.unshift(reward);
        newlyUnlocked++;
      }
    }
    this.saveToStorage();
    return newlyUnlocked;
  }

  approveReward(rewardId: string, adminId: string = 'admin-1'): MilestoneReward {
    const reward = this.rewards.find(r => r.id === rewardId);
    if (!reward) throw new Error('Reward not found.');
    if (reward.status === 'PAID') throw new Error('Reward already paid.');

    const beforeState = { ...reward };
    reward.status = 'PAID';
    reward.paidAt = new Date().toISOString();

    const user = this.getUserById(reward.userId);
    if (user) {
      user.profitBalance += reward.rewardAmount;
      user.totalRewardsEarned += reward.rewardAmount;
    }

    this.addAuditLog(adminId, 'APPROVE_REWARD_MILESTONE', 'MilestoneReward', reward.id, beforeState, reward);
    this.saveToStorage();
    return reward;
  }

  // --- Support Tickets & Messaging ---
  createSupportTicket(userId: string, subject: string, category: any, transactionRef?: string, initialMessage?: string): SupportTicket {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found.');

    const ticket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      userId,
      userName: user.name,
      userEmail: user.email,
      subject,
      category,
      transactionReference: transactionRef,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tickets.unshift(ticket);

    if (initialMessage) {
      const msg: SupportMessage = {
        id: `msg-${Date.now()}`,
        ticketId: ticket.id,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        message: initialMessage,
        createdAt: new Date().toISOString(),
      };
      this.messages.push(msg);
    }

    this.saveToStorage();
    return ticket;
  }

  addSupportMessage(ticketId: string, senderId: string, message: string, isInternalNote: boolean = false): SupportMessage {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found.');

    const sender = this.getUserById(senderId);
    if (!sender) throw new Error('Sender not found.');

    const msg: SupportMessage = {
      id: `msg-${Date.now()}`,
      ticketId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      message,
      isInternalNote,
      createdAt: new Date().toISOString(),
    };

    this.messages.push(msg);
    ticket.updatedAt = new Date().toISOString();
    if (sender.role === 'ADMIN' && !isInternalNote) {
      ticket.status = 'IN_PROGRESS';
    }

    this.saveToStorage();
    return msg;
  }

  updateTicketStatus(ticketId: string, status: any, adminId: string = 'admin-1'): SupportTicket {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found.');

    const beforeState = { ...ticket };
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();

    this.addAuditLog(adminId, 'UPDATE_TICKET_STATUS', 'SupportTicket', ticket.id, beforeState, ticket);
    this.saveToStorage();
    return ticket;
  }

  private addAuditLog(adminId: string, action: string, entity: string, entityId: string, beforeSnapshot?: any, afterSnapshot?: any) {
    const admin = this.getUserById(adminId);
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      adminId,
      adminEmail: admin ? admin.email : 'system@fte.com',
      action,
      entity,
      entityId,
      beforeSnapshot,
      afterSnapshot,
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
  }

  // Reset demo store back to original seed data
  resetStore() {
    this.users = INITIAL_USERS;
    this.investments = INITIAL_INVESTMENTS;
    this.tradingProfits = INITIAL_TRADING_PROFITS;
    this.commissions = INITIAL_COMMISSIONS;
    this.deposits = INITIAL_DEPOSITS;
    this.withdrawals = INITIAL_WITHDRAWALS;
    this.rewards = INITIAL_REWARDS;
    this.tickets = INITIAL_TICKETS;
    this.messages = INITIAL_MESSAGES;
    this.auditLogs = INITIAL_AUDIT_LOGS;
    this.activeUserId = 'user-1';
    this.saveToStorage();
  }
}

export const mockStore = new StoreManager();
