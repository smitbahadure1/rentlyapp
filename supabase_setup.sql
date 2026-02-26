-- Rently Database Schema Setup
-- Run this SQL in your Supabase SQL Editor

-- 1. Create the users table (Profiles)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Clerk User ID
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone_number TEXT,
    driving_license TEXT,
    role TEXT DEFAULT 'user', -- 'user' or 'admin'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the cars table
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
    description TEXT,
    location TEXT DEFAULT 'Mumbai',
    status TEXT DEFAULT 'available', -- 'available', 'rented', 'maintenance'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id TEXT NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('active', 'upcoming', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    total_price NUMERIC NOT NULL,
    pickup_location TEXT NOT NULL,
    drop_location TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create the payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT,
    transaction_id TEXT,
    status TEXT DEFAULT 'success' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create the inspections table
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id TEXT NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    inspector_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('check-out', 'check-in', 'routine')),
    status TEXT DEFAULT 'passed' CHECK (status IN ('passed', 'failed', 'needs_attention')),
    notes TEXT,
    damage_reported BOOLEAN DEFAULT false,
    fuel_level INTEGER DEFAULT 100 CHECK (fuel_level >= 0 AND fuel_level <= 100),
    mileage INTEGER,
    images TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id TEXT NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON public.bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_cars_status ON public.cars(status);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_inspections_car_id ON public.inspections(car_id);
CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON public.reviews(car_id);

-- 8. Create a view for Admin Dashboard Stats
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM public.cars) AS total_cars,
    (SELECT COUNT(*) FROM public.cars WHERE status = 'available') AS available_cars,
    (SELECT COUNT(*) FROM public.bookings) AS total_bookings,
    (SELECT COUNT(*) FROM public.bookings WHERE status = 'active') AS active_bookings,
    (SELECT COUNT(*) FROM public.bookings WHERE status = 'upcoming') AS upcoming_bookings,
    COALESCE((SELECT SUM(total_price) FROM public.bookings WHERE status != 'cancelled'), 0) AS total_revenue;

-- 9. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 10. Create policies (Simplified for easy full app functionality without strict rules hindering it during build)
CREATE POLICY "Anyone can do anything with users" ON public.users FOR ALL USING (true);
CREATE POLICY "Anyone can do anything with cars" ON public.cars FOR ALL USING (true);
CREATE POLICY "Anyone can do anything with bookings" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Anyone can do anything with payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Anyone can do anything with inspections" ON public.inspections FOR ALL USING (true);
CREATE POLICY "Anyone can do anything with reviews" ON public.reviews FOR ALL USING (true);

-- 11. Create triggers to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cars_updated_at ON public.cars;
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Done! Your database is now ready for Rently 🚗💎
