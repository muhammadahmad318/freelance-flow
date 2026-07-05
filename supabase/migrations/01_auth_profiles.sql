-- ==========================================
-- MODULE 1: AUTHENTICATION & USER PROFILES
-- PURPOSE: Extend Supabase Auth with a Public Profile
-- ==========================================

-- 1. Create the profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT full_name_length CHECK (char_length(full_name) >= 3)
);

-- 1.5 GRANT API PERMISSIONS (Door 1: RBAC)
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;

-- 2. Enable RLS (Door 2: Zero-Trust)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Define Policies (The "S" in SOLID: Single Responsibility)
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. Automated Profile Creation (Trigger Function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Bind Trigger to Auth Schema
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();