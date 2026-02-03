-- Fix RLS policies to allow proper access
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

-- Create permissive policies (for development - you can tighten later)
CREATE POLICY "Enable read access for all users" ON public.bookings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.bookings
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.bookings
    FOR DELETE USING (true);

-- Verify RLS is still enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
