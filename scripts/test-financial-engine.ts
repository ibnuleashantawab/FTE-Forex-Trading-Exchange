import {
  calculateDepositCharge,
  calculateWithdrawalCharge,
  calculateDailyProfit,
  isTradingDay,
  checkLevel1Eligibility,
  calculateGen1Commission,
  calculateMilestonesUnlocked,
  CONSTANTS,
} from '../lib/services/financialEngine';
import { User, Investment } from '../types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failed++;
  }
}

console.log('=== FTE FINANCIAL ENGINE AUTOMATED TEST SUITE ===\n');

// 1. Test Deposit Bounds & 3% Charge Calculation
try {
  const dep1 = calculateDepositCharge(1000);
  assert(dep1.fee === 30 && dep1.netAmount === 970, 'Deposit $1,000 calculates 3% ($30) fee and $970 net capital');
} catch (e: any) {
  assert(false, `Deposit $1,000 charge calculation failed: ${e.message}`);
}

try {
  calculateDepositCharge(49);
  assert(false, 'Deposit below $50 should be rejected');
} catch {
  assert(true, 'Deposit below $50 correctly rejected with validation error');
}

try {
  calculateDepositCharge(50001);
  assert(false, 'Deposit above $50,000 should be rejected');
} catch {
  assert(true, 'Deposit above $50,000 correctly rejected with validation error');
}

// 2. Test Withdrawal 3% Charge Calculation
try {
  const wth1 = calculateWithdrawalCharge(100);
  assert(wth1.fee === 3 && wth1.netPayout === 97, 'Withdrawal $100 calculates 3% ($3) fee and $97 net payout');
} catch (e: any) {
  assert(false, `Withdrawal $100 charge calculation failed: ${e.message}`);
}

// 3. Test Mon-Fri 0.60% Daily Profit Calculation
const mondayDate = new Date('2026-08-10T12:00:00Z'); // Monday
const sundayDate = new Date('2026-08-09T12:00:00Z'); // Sunday

const monProfit = calculateDailyProfit(1000, mondayDate);
assert(monProfit === 6.00, 'Monday profit on $1,000 eligible capital @ 0.60% is exactly $6.00');

const sunProfit = calculateDailyProfit(1000, sundayDate);
assert(sunProfit === 0, 'Sunday non-trading day produces $0.00 profit');

// 4. Test Level-1 Qualification Audit
const mockUser: User = {
  id: 'u1',
  name: 'Test Sponsor',
  email: 'test@fte.com',
  role: 'USER',
  sponsorId: null,
  referralCode: 'TEST-01',
  level1Qualified: false,
  level1QualifiedAt: null,
  status: 'ACTIVE',
  twoFactorEnabled: false,
  createdAt: new Date().toISOString(),
  mainBalance: 0,
  profitBalance: 0,
  totalInvested: 500,
  totalProfitEarned: 0,
  totalCommissionEarned: 0,
  totalRewardsEarned: 0,
};

const ownInvestments: Investment[] = [
  {
    id: 'inv1',
    userId: 'u1',
    amount: 500,
    charge: 15,
    approvedAmount: 500,
    status: 'APPROVED',
    createdAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
  },
];

// Case A: 3 direct referrals (below 4 count) -> Should fail
const refsCaseA: User[] = [
  { ...mockUser, id: 'r1', totalInvested: 500 },
  { ...mockUser, id: 'r2', totalInvested: 500 },
  { ...mockUser, id: 'r3', totalInvested: 500 },
];
const evalA = checkLevel1Eligibility(mockUser, ownInvestments, refsCaseA);
assert(evalA.isQualified === false, 'Sponsor with only 3 referrals is NOT Level-1 qualified');

// Case B: 4 direct referrals each >= $500 -> Should pass
const refsCaseB: User[] = [
  { ...mockUser, id: 'r1', totalInvested: 500 },
  { ...mockUser, id: 'r2', totalInvested: 600 },
  { ...mockUser, id: 'r3', totalInvested: 1000 },
  { ...mockUser, id: 'r4', totalInvested: 500 },
];
const evalB = checkLevel1Eligibility(mockUser, ownInvestments, refsCaseB);
assert(evalB.isQualified === true, 'Sponsor with $500 capital + 4 direct referrals each >= $500 IS Level-1 qualified');

// 5. Test Generation-1 40% Commission
const commCalc = calculateGen1Commission(10.00);
assert(commCalc === 4.00, '40% Gen-1 commission on $10 direct member trading profit is exactly $4.00');

// 6. Test Team Milestone Rewards ($50,000 steps)
assert(calculateMilestonesUnlocked(49999) === 0, '$49,999 team volume unlocks 0 rewards');
assert(calculateMilestonesUnlocked(50000) === 1, '$50,000 team volume unlocks 1 x $10,000 reward');
assert(calculateMilestonesUnlocked(100000) === 2, '$100,000 team volume unlocks 2 x $10,000 rewards');

console.log(`\n==============================================`);
console.log(`TEST SUMMARY: Passed: ${passed} | Failed: ${failed}`);
console.log(`==============================================\n`);

if (failed > 0) {
  process.exit(1);
}
