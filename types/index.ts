export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  sponsorId: string | null; // Direct sponsor ID
  referralCode: string;
  level1Qualified: boolean;
  level1QualifiedAt: string | null;
  status: 'ACTIVE' | 'FROZEN' | 'SUSPENDED';
  twoFactorEnabled: boolean;
  createdAt: string;
  
  // Computed balances
  mainBalance: number;
  profitBalance: number;
  totalInvested: number;
  totalProfitEarned: number;
  totalCommissionEarned: number;
  totalRewardsEarned: number;
}

export type InvestmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Investment {
  id: string;
  userId: string;
  amount: number;
  charge: number; // 3% deposit charge if applicable
  approvedAmount: number;
  status: InvestmentStatus;
  createdAt: string;
  approvedAt: string | null;
}

export type ProfitStatus = 'CREDITED' | 'REVERSED';

export interface TradingProfit {
  id: string;
  userId: string;
  investmentReferenceId?: string;
  date: string; // YYYY-MM-DD
  rate: number; // e.g. 0.006 (0.60%)
  eligibleCapital: number;
  amount: number;
  status: ProfitStatus;
  createdAt: string;
}

export interface ReferralRelation {
  id: string;
  sponsorId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberInvestment: number;
  generation: 1; // SRS restricts commission to Gen-1 only
  createdAt: string;
}

export interface CommissionRecord {
  id: string;
  sponsorId: string;
  sourceMemberId: string;
  sourceMemberName: string;
  sourceProfitId: string;
  sourceProfitAmount: number;
  generation: 1;
  rate: number; // 0.40 (40%)
  amount: number;
  status: 'PAID' | 'REVERSED';
  createdAt: string;
}

export interface TeamVolume {
  userId: string;
  totalTeamVolume: number;
  qualifyingTeamMembersCount: number;
  completedMilestones: number; // count of $50k blocks
  nextMilestoneTarget: number;
  updatedAt: string;
}

export type RewardStatus = 'UNLOCKED' | 'CLAIMED' | 'APPROVED' | 'PAID';

export interface MilestoneReward {
  id: string;
  userId: string;
  milestoneIndex: number; // 1 for $50k, 2 for $100k, 3 for $150k...
  threshold: number; // $50,000
  rewardAmount: number; // $10,000
  status: RewardStatus;
  createdAt: string;
  paidAt: string | null;
}

export type DepositMethod = 'USDT_TRC20' | 'USDT_ERC20' | 'BTC' | 'BANK_TRANSFER';
export type DepositStatus = 'PENDING' | 'VERIFYING' | 'APPROVED' | 'REJECTED';

export interface DepositRecord {
  id: string;
  userId: string;
  grossAmount: number;
  fee: number; // 3%
  netAmount: number;
  method: DepositMethod;
  referenceNumber: string;
  proofUrl?: string;
  status: DepositStatus;
  createdAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export type WalletType = 'PROFIT_WALLET' | 'MAIN_BALANCE_WALLET';
export type WithdrawalStatus = 'PENDING' | 'REVIEW' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export interface WithdrawalRecord {
  id: string;
  userId: string;
  walletType: WalletType;
  requestedAmount: number;
  fee: number; // 3%
  netPayout: number;
  payoutMethod: DepositMethod;
  payoutDetails: string;
  status: WithdrawalStatus;
  payoutReference?: string;
  createdAt: string;
  updatedAt?: string;
  adminNotes?: string;
}

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADING_PROFIT' | 'COMMISSION' | 'ACCOUNT' | 'OTHER';
  transactionReference?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  attachmentUrl?: string;
  isInternalNote?: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  entity: string;
  entityId: string;
  beforeSnapshot?: any;
  afterSnapshot?: any;
  ipAddress: string;
  createdAt: string;
}
