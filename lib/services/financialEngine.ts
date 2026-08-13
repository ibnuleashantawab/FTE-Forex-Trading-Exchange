import { User, Investment, TradingProfit, ReferralRelation, CommissionRecord, MilestoneReward, DepositRecord, WithdrawalRecord } from '@/types';

export const CONSTANTS = {
  MIN_INVESTMENT: 50,
  MAX_INVESTMENT: 50000,
  DAILY_PROFIT_RATE: 0.006, // 0.60%
  DEPOSIT_CHARGE_RATE: 0.03, // 3%
  WITHDRAWAL_CHARGE_RATE: 0.03, // 3%
  LEVEL1_MIN_OWN_INVESTMENT: 500,
  LEVEL1_MIN_DIRECT_REFERRALS: 4,
  LEVEL1_MIN_REFERRAL_INVESTMENT: 500,
  GEN1_COMMISSION_RATE: 0.40, // 40%
  REWARD_MILESTONE_STEP: 50000, // $50,000 team investment
  REWARD_MILESTONE_AMOUNT: 10000, // $10,000 reward
};

/**
 * 8.2 Deposit Charge:
 * Deposit Charge = Deposit Amount * 0.03
 * Net Credited Amount = Deposit Amount * 0.97
 */
export function calculateDepositCharge(grossAmount: number) {
  if (grossAmount < CONSTANTS.MIN_INVESTMENT || grossAmount > CONSTANTS.MAX_INVESTMENT) {
    throw new Error(`Investment must be between $${CONSTANTS.MIN_INVESTMENT} and $${CONSTANTS.MAX_INVESTMENT}.`);
  }
  const fee = Number((grossAmount * CONSTANTS.DEPOSIT_CHARGE_RATE).toFixed(2));
  const netAmount = Number((grossAmount - fee).toFixed(2));
  return { grossAmount, fee, netAmount };
}

/**
 * 8.3 Withdrawal Charge:
 * Withdrawal Charge = Requested Withdrawal * 0.03
 * Net Payout = Requested Withdrawal * 0.97
 */
export function calculateWithdrawalCharge(requestedAmount: number) {
  if (requestedAmount <= 0) {
    throw new Error("Withdrawal amount must be greater than 0.");
  }
  const fee = Number((requestedAmount * CONSTANTS.WITHDRAWAL_CHARGE_RATE).toFixed(2));
  const netPayout = Number((requestedAmount - fee).toFixed(2));
  return { requestedAmount, fee, netPayout };
}

/**
 * 8.1 Daily Trading Profit:
 * Daily Trading Profit = Eligible Investment Capital * 0.006 (Mon-Fri only)
 */
export function isTradingDay(date: Date = new Date()): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday (1) to Friday (5)
}

export function calculateDailyProfit(eligibleCapital: number, date: Date = new Date()): number {
  if (!isTradingDay(date)) {
    return 0; // Weekend non-trading days
  }
  return Number((eligibleCapital * CONSTANTS.DAILY_PROFIT_RATE).toFixed(2));
}

/**
 * 3.2 Level-1 Qualification Checklist:
 * - Own eligible investment >= $500
 * - At least 4 direct referrals
 * - Each of those 4 referrals has investment >= $500
 */
export function checkLevel1Eligibility(user: User, userInvestments: Investment[], directReferrals: User[]) {
  const totalOwnApprovedInvestment = userInvestments
    .filter(inv => inv.status === 'APPROVED')
    .reduce((sum, inv) => sum + inv.approvedAmount, 0);

  const ownCapitalQualified = totalOwnApprovedInvestment >= CONSTANTS.LEVEL1_MIN_OWN_INVESTMENT;

  // Filter referrals who have at least $500 approved investment
  const qualifiedDirectReferrals = directReferrals.filter(ref => ref.totalInvested >= CONSTANTS.LEVEL1_MIN_REFERRAL_INVESTMENT);
  const referralsCountQualified = qualifiedDirectReferrals.length >= CONSTANTS.LEVEL1_MIN_DIRECT_REFERRALS;

  const isQualified = ownCapitalQualified && referralsCountQualified;

  return {
    isQualified,
    ownCapitalQualified,
    ownCapital: totalOwnApprovedInvestment,
    ownCapitalRequired: CONSTANTS.LEVEL1_MIN_OWN_INVESTMENT,
    referralsCountQualified,
    qualifiedReferralsCount: qualifiedDirectReferrals.length,
    referralsRequired: CONSTANTS.LEVEL1_MIN_DIRECT_REFERRALS,
    qualifiedReferralMinInvestment: CONSTANTS.LEVEL1_MIN_REFERRAL_INVESTMENT,
  };
}

/**
 * 8.4 Generation-1 Commission:
 * Generation-1 Commission = Eligible First-Generation Trading Income * 0.40
 */
export function calculateGen1Commission(gen1DailyTradingIncome: number): number {
  if (gen1DailyTradingIncome <= 0) return 0;
  return Number((gen1DailyTradingIncome * CONSTANTS.GEN1_COMMISSION_RATE).toFixed(2));
}

/**
 * 3.4 Reward Plan Calculation:
 * $50,000 team volume -> $10,000 reward
 * Each additional $50,000 -> additional $10,000
 */
export function calculateMilestonesUnlocked(teamVolume: number): number {
  if (teamVolume < CONSTANTS.REWARD_MILESTONE_STEP) return 0;
  return Math.floor(teamVolume / CONSTANTS.REWARD_MILESTONE_STEP);
}
