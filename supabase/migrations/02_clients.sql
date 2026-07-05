-- ==========================================
-- MODULE 3: CLIENT MANAGEMENT
-- FILE: 02_clients.sql
-- PURPOSE: Create and secure the clients table with multi-tenant isolation
-- ==========================================

-- ------------------------------------------
-- 1. Table Definition & Referential Integrity
-- ------------------------------------------
CREATE TABLE public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE, 
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ------------------------------------------
-- 1.5 API Role Permissions (Door 1: RBAC)
-- ------------------------------------------
GRANT ALL ON TABLE public.clients TO anon, authenticated, service_role;

-- ------------------------------------------
-- 2. Data Integrity Constraints
-- ------------------------------------------
ALTER TABLE public.clients
ADD CONSTRAINT clients_name_length_check 
CHECK (char_length(trim(name)) >= 2);

ALTER TABLE public.clients
ADD CONSTRAINT clients_email_format_check 
CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');

-- ------------------------------------------
-- 3. Row Level Security (Zero-Trust)
-- ------------------------------------------
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own clients" 
ON public.clients FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clients" 
ON public.clients FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" 
ON public.clients FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" 
ON public.clients FOR DELETE 
USING (auth.uid() = user_id);

-- ------------------------------------------
-- 4. Database Automation (Housekeeping)
-- ------------------------------------------

-- Note: We use 'CREATE OR REPLACE' so this doesn't fail if we run it multiple times.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- ==========================================
-- STEP 5.1: Enable Trigram Matching
-- STEP 5.2: Apply Generalized Inverted Indexes
-- ==========================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_clients_name_trgm 
ON public.clients 
USING GIN (name gin_trgm_ops);

CREATE INDEX idx_clients_email_trgm 
ON public.clients 
USING GIN (email gin_trgm_ops);

CREATE INDEX idx_clients_company_trgm 
ON public.clients 
USING GIN (company gin_trgm_ops);