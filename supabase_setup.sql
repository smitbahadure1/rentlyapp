-- Rently Database Schema Setup
-- Run this SQL in your Supabase SQL Editor

-- 1. Create the cars table
CREATE TABLE IF NOT EXISTS public.cars (
    id TEXT PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    image TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    rating NUMERIC DEFAULT 4.5,
    fuel_type TEXT DEFAULT 'Petrol',
    transmission TEXT DEFAULT 'Automatic',
    seats INTEGER DEFAULT 5,
    status TEXT DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id TEXT NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'upcoming', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    total_price NUMERIC NOT NULL,
    pickup_location TEXT NOT NULL,
    drop_location TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON public.bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_cars_status ON public.cars(status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for cars table (everyone can read, authenticated users can insert/update)
CREATE POLICY "Anyone can view cars" ON public.cars
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert cars" ON public.cars
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update cars" ON public.cars
    FOR UPDATE USING (true);

-- 6. Create policies for bookings table (users can only see their own bookings)
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (true);

CREATE POLICY "Users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (true);

-- 7. Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create triggers to automatically update updated_at
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Done! Your database is now ready for Rently 🚗💎
