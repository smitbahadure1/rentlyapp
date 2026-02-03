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
