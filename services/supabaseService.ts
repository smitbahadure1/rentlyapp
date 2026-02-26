import { supabase } from '@/lib/supabase';
import { logError, logInfo, logWarn } from '../config/production';

export interface SupabaseCar {
    id: string;
    brand: string;
    model: string;
    image: string;
    price: number;
    rating: number;
    fuel_type: string;
    transmission: string;
    seats: number;
    status: string;
}

export interface SupabaseBooking {
    id: string;
    car_id: string;
    user_id: string;
    status: 'active' | 'upcoming' | 'completed' | 'cancelled';
    start_date: string;
    end_date: string;
    total_price: number;
    pickup_location: string;
    drop_location: string;
    payment_status?: 'pending' | 'paid' | 'refunded';
}

export interface SupabaseUser {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    phone_number?: string;
    driving_license?: string;
    role?: 'user' | 'admin';
}

export interface SupabasePayment {
    id?: string;
    booking_id: string;
    user_id: string;
    amount: number;
    currency?: string;
    payment_method?: string;
    transaction_id?: string;
    status?: 'pending' | 'success' | 'failed' | 'refunded';
}

export interface SupabaseInspection {
    id?: string;
    car_id: string;
    booking_id?: string;
    inspector_id: string;
    type: 'check-out' | 'check-in' | 'routine';
    status?: 'passed' | 'failed' | 'needs_attention';
    notes?: string;
    damage_reported?: boolean;
    fuel_level?: number;
    mileage?: number;
    images?: string[];
}

export interface SupabaseReview {
    id?: string;
    car_id: string;
    user_id: string;
    booking_id?: string;
    rating: number;
    comment?: string;
}

/**
 * Fetch all cars from Supabase
 */
export async function fetchCars() {
    const { data, error } = await supabase
        .from('cars')
        .select('*');

    if (error) {
        logWarn('Supabase cars fetch failed (using fallback):', error);
        return [];
    }
    return data;
}

/**
 * Fetch bookings for the current user
 */
export async function fetchUserBookings(userId: string) {
    logInfo('🔍 Fetching bookings for user:', userId);
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            cars (*)
        `)
        .eq('user_id', userId);

    if (error) {
        logError('❌ Supabase error fetching bookings:', error);
        return [];
    }
    logInfo('✅ Supabase returned:', data?.length || 0, 'bookings');
    return data;
}

/**
 * Create a new booking in Supabase
 */
export async function createSupabaseBooking(bookingData: Omit<SupabaseBooking, 'id'>) {
    const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select();

    if (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
    return data[0];
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId: string, status: SupabaseBooking['status']) {
    const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select();

    if (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
    return data[0];
}

/**
 * Upsert a car to ensure it exists in Supabase
 */
export async function upsertCar(carData: any) {
    const carId = carData.id;
    if (!carId) throw new Error('Car ID is required for upsert');

    const { data, error } = await supabase
        .from('cars')
        .upsert([{
            id: carId,
            brand: carData.brand || 'Unknown',
            model: carData.model || 'Premium Model',
            image: carData.image || '',
            price: Number(carData.price) || 0,
            rating: Number(carData.rating) || 4.5,
            fuel_type: carData.fuelType || carData.fuel_type || 'Petrol',
            transmission: carData.transmission || 'Automatic',
            seats: Number(carData.seats) || 5,
            status: carData.status || 'available'
        }])
        .select();

    if (error) {
        console.error('Error upserting car:', error);
        throw error;
    }
    return data[0];
}

/**
 * Upsert a user in Supabase (Sync from Clerk)
 */
export async function upsertUser(userData: SupabaseUser) {
    if (!userData.id) throw new Error('User ID is required');

    const { data, error } = await supabase
        .from('users')
        .upsert([userData])
        .select();

    if (error) {
        console.error('Error upserting user:', error);
        throw error;
    }
    return data[0];
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
    if (error) {
        logWarn('User not found in public.users, might need sync:', error);
        return null;
    }
    return data;
}

/**
 * Create a payment record
 */
export async function createPayment(paymentData: SupabasePayment) {
    const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select();

    if (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
    return data[0];
}

/**
 * Create a vehicle inspection report
 */
export async function createInspection(inspectionData: SupabaseInspection) {
    const { data, error } = await supabase
        .from('inspections')
        .insert([inspectionData])
        .select();

    if (error) {
        console.error('Error creating inspection:', error);
        throw error;
    }
    return data[0];
}

/**
 * Add a review for a car
 */
export async function addReview(reviewData: SupabaseReview) {
    const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select();

    if (error) {
        console.error('Error adding review:', error);
        throw error;
    }
    return data[0];
}

/**
 * Fetch reviews for a specific car
 */
export async function fetchCarReviews(carId: string) {
    const { data, error } = await supabase
        .from('reviews')
        .select('*, users(full_name, avatar_url)')
        .eq('car_id', carId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
    return data;
}
