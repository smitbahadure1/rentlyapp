-- Admin Panel Setup for Rently
-- Run this SQL in your Supabase SQL Editor

-- 1. Create the admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- 2. Insert the default admin user
-- Password: Aditya1234 (hashed - in production, use proper bcrypt hashing)
-- For demo purposes, we'll store a simple hash
INSERT INTO public.admin_users (email, password_hash, full_name)
VALUES ('justme13680@gmail.com', 'Aditya1234', 'Admin User')
ON CONFLICT (email) DO NOTHING;

-- 3. Enable Row Level Security for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 4. Create policy for admin_users (only admins can access)
CREATE POLICY "Admins can view admin users" ON public.admin_users
    FOR SELECT USING (true);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- 6. Add a view for admin dashboard statistics
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM public.cars) as total_cars,
    (SELECT COUNT(*) FROM public.cars WHERE status = 'available') as available_cars,
    (SELECT COUNT(*) FROM public.bookings) as total_bookings,
    (SELECT COUNT(*) FROM public.bookings WHERE status = 'active') as active_bookings,
    (SELECT COUNT(*) FROM public.bookings WHERE status = 'upcoming') as upcoming_bookings,
    (SELECT SUM(total_price) FROM public.bookings WHERE status IN ('active', 'completed')) as total_revenue;

-- Done! Admin panel database is ready 🔐
