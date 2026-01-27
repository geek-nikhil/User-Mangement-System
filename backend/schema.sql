-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
-- Stores user information. We DO NOT use Supabase Auth for this test, 
-- but implemented custom JWT auth, so we need a users table.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed password (Bcrypt)
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTS TABLE
-- Stores product details for the e-commerce section.
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TRANSACTIONS TABLE
-- Stores sales transactions for the performance test (Test 4).
-- We will seed this with 100k records.
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES
-- Critical for performance, especially for the 100k transactions test.
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- ANALYTICS FUNCTION (RPC)
-- Efficiently calculates total count, total revenue, and monthly breakdown.
-- Usage from JS: const { data, error } = await supabase.rpc('get_transaction_stats');
CREATE OR REPLACE FUNCTION get_transaction_stats()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    total_count INTEGER;
    total_revenue DECIMAL(15, 2);
    monthly_data JSON;
BEGIN
    -- 1. Get Total Count
    SELECT COUNT(*) INTO total_count FROM transactions;

    -- 2. Get Total Revenue
    SELECT COALESCE(SUM(amount), 0) INTO total_revenue FROM transactions;

    -- 3. Get Monthly Breakdown
    SELECT json_agg(t) INTO monthly_data
    FROM (
        SELECT 
            TO_CHAR(created_at, 'YYYY-MM') AS month,
            COUNT(*) AS count,
            SUM(amount) AS revenue
        FROM transactions
        GROUP BY 1
        ORDER BY 1 DESC
    ) t;

    -- Return JSON object
    RETURN json_build_object(
        'totalTransactions', total_count,
        'totalRevenue', total_revenue,
        'monthlyBreakdown', monthly_data
    );
END;
$$;

