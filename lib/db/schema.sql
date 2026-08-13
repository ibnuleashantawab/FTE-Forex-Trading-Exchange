-- FTE (Forex Trading Exchange) Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS) & Audit Policies

-- 1. Enum Types
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'FROZEN', 'SUSPENDED');
CREATE TYPE investment_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE profit_status AS ENUM ('CREDITED', 'REVERSED');
CREATE TYPE deposit_method AS ENUM ('USDT_TRC20', 'USDT_ERC20', 'BTC', 'BANK_TRANSFER');
CREATE TYPE deposit_status AS ENUM ('PENDING', 'VERIFYING', 'APPROVED', 'REJECTED');
CREATE TYPE wallet_type AS ENUM ('PROFIT_WALLET', 'MAIN_BALANCE_WALLET');
CREATE TYPE withdrawal_status AS ENUM ('PENDING', 'REVIEW', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED', 'CANCELLED');
CREATE TYPE reward_status AS ENUM ('UNLOCKED', 'CLAIMED', 'APPROVED', 'PAID');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- 2. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role user_role DEFAULT 'USER',
    sponsor_id UUID REFERENCES users(id),
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    level1_qualified BOOLEAN DEFAULT FALSE,
    level1_qualified_at TIMESTAMP WITH TIME ZONE,
    status user_status DEFAULT 'ACTIVE',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    main_balance NUMERIC(15,2) DEFAULT 0.00,
    profit_balance NUMERIC(15,2) DEFAULT 0.00,
    total_invested NUMERIC(15,2) DEFAULT 0.00,
    total_profit_earned NUMERIC(15,2) DEFAULT 0.00,
    total_commission_earned NUMERIC(15,2) DEFAULT 0.00,
    total_rewards_earned NUMERIC(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Investments Table (Enforces $50 - $50,000 limits)
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(15,2) NOT NULL CHECK (amount >= 50.00 AND amount <= 50000.00),
    charge NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    approved_amount NUMERIC(15,2) NOT NULL,
    status investment_status DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE
);

-- 4. Trading Profits Table (0.60% daily calculation Mon-Fri)
CREATE TABLE trading_profits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    investment_id UUID REFERENCES investments(id),
    date DATE NOT NULL,
    rate NUMERIC(5,4) DEFAULT 0.0060, -- 0.60%
    eligible_capital NUMERIC(15,2) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    status profit_status DEFAULT 'CREDITED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_daily_profit UNIQUE (user_id, date) -- Idempotency locking
);

-- 5. Generation-1 Commissions Table (40% rate)
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_member_id UUID NOT NULL REFERENCES users(id),
    source_profit_id UUID NOT NULL REFERENCES trading_profits(id),
    generation INT DEFAULT 1 CHECK (generation = 1), -- SRS enforces Gen-1 only
    rate NUMERIC(5,4) DEFAULT 0.4000, -- 40%
    amount NUMERIC(15,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Deposits Table (3% fee)
CREATE TABLE deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gross_amount NUMERIC(15,2) NOT NULL CHECK (gross_amount >= 50.00 AND gross_amount <= 50000.00),
    fee NUMERIC(15,2) NOT NULL, -- 3%
    net_amount NUMERIC(15,2) NOT NULL,
    method deposit_method NOT NULL,
    reference_number VARCHAR(255) NOT NULL,
    proof_url TEXT,
    status deposit_status DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Withdrawals Table (3% fee, separate profit vs main balance)
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_type wallet_type NOT NULL,
    requested_amount NUMERIC(15,2) NOT NULL CHECK (requested_amount >= 10.00),
    fee NUMERIC(15,2) NOT NULL, -- 3%
    net_payout NUMERIC(15,2) NOT NULL,
    payout_method deposit_method NOT NULL,
    payout_details TEXT NOT NULL,
    status withdrawal_status DEFAULT 'PENDING',
    payout_reference VARCHAR(255),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 8. Milestone Rewards Table ($10,000 per $50,000 team volume)
CREATE TABLE milestone_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    milestone_index INT NOT NULL,
    threshold NUMERIC(15,2) DEFAULT 50000.00,
    reward_amount NUMERIC(15,2) DEFAULT 10000.00,
    status reward_status DEFAULT 'UNLOCKED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_user_milestone UNIQUE (user_id, milestone_index) -- Prevents double reward
);

-- 9. Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id),
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(255) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    before_snapshot JSONB,
    after_snapshot JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_profits ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_rewards ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY user_self_access ON users FOR SELECT USING (auth.uid() = id OR auth.jwt()->>'role' = 'ADMIN');
CREATE POLICY user_investments_access ON investments FOR SELECT USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'ADMIN');
CREATE POLICY user_profits_access ON trading_profits FOR SELECT USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'ADMIN');
CREATE POLICY user_commissions_access ON commissions FOR SELECT USING (auth.uid() = sponsor_id OR auth.jwt()->>'role' = 'ADMIN');
