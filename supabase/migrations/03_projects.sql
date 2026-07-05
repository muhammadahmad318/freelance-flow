-- ==========================================
-- MODULE 4: PROJECT MANAGEMENT
-- STEP 1: Relational Foundation & Integrity
-- ==========================================

CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Foreign Keys
    user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    
    -- Core Fields
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' NOT NULL,
    start_date DATE,
    end_date DATE,
    budget NUMERIC(15, 2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Constraints
    CONSTRAINT projects_status_check CHECK (status IN ('draft', 'active', 'completed', 'on_hold')),
    CONSTRAINT projects_date_check CHECK (end_date >= start_date)
);

-- Door 1: API Role Permissions
GRANT ALL ON TABLE public.projects TO anon, authenticated, service_role;

-- ==========================================
-- MODULE 4: PROJECT MANAGEMENT
-- STEP 2: Zero-Trust Security (RLS)
-- ==========================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 1. READ: Users can only see projects they own
CREATE POLICY "Users can view their own projects" 
ON public.projects FOR SELECT 
USING (auth.uid() = user_id);

-- 2. CREATE: Must own the project AND the associated client
CREATE POLICY "Users can create projects for their own clients" 
ON public.projects FOR INSERT 
WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
        SELECT 1 
        FROM public.clients 
        WHERE clients.id = projects.client_id 
        AND clients.user_id = auth.uid()
    )
);

-- 3. UPDATE: Must own the project AND the new client (if reassigned)
CREATE POLICY "Users can update their own projects" 
ON public.projects FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
        SELECT 1 
        FROM public.clients 
        WHERE clients.id = projects.client_id 
        AND clients.user_id = auth.uid()
    )
);

-- 4. DELETE: Users can only delete projects they own
CREATE POLICY "Users can delete their own projects" 
ON public.projects FOR DELETE 
USING (auth.uid() = user_id);

-- ==========================================
-- MODULE 4: PROJECT MANAGEMENT
-- STEP 3.1: Database Automation (Housekeeping)
-- ==========================================

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- ==========================================
-- MODULE 4: PROJECT MANAGEMENT
-- STEP 3.2: Search Optimization (GIN Indexes)
-- ==========================================

CREATE INDEX idx_projects_name_trgm 
ON public.projects 
USING GIN (name gin_trgm_ops);

CREATE INDEX idx_projects_description_trgm 
ON public.projects 
USING GIN (description gin_trgm_ops);