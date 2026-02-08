import { supabase } from '@/lib/supabase';
import { logError, logInfo } from '../config/production';

export interface AdminUser {
    id: string;
    email: string;
    full_name: string;
    last_login?: string;
}

export interface AdminDashboardStats {
    total_cars: number;
    available_cars: number;
    total_bookings: number;
    active_bookings: number;
    upcoming_bookings: number;
    total_revenue: number;
}

export interface BookingWithDetails {
    id: string;
    car_id: string;
    user_id: string;
    status: 'active' | 'upcoming' | 'completed' | 'cancelled';
    start_date: string;
    end_date: string;
    total_price: number;
    pickup_location: string;
    drop_location: string;
    created_at: string;
    cars: {
        brand: string;
        model: string;
        image: string;
    };
}

/**
 * Admin authentication - simple check for demo purposes
 * In production, use proper authentication with hashed passwords
 */
export async function adminSignIn(email: string, password: string): Promise<AdminUser | null> {
    try {
        // For demo purposes, hardcoded check
        if (email === 'justme13680@gmail.com' && password === 'Aditya1234') {
            // In production, query the database
            const adminUser: AdminUser = {
                id: 'admin-001',
                email: email,
                full_name: 'Admin User',
                last_login: new Date().toISOString()
            };

            logInfo('✅ Admin login successful:', email);
            return adminUser;
        }

        logError('❌ Invalid admin credentials');
        return null;
    } catch (error) {
        logError('❌ Admin sign in error:', error);
        return null;
    }
}

/**
 * Fetch dashboard statistics
 */
/**
 * Fetch dashboard statistics
 */
export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
    try {
        // Since the view 'admin_dashboard_stats' doesn't exist, we'll fetch manual counts
        const [carsResult, bookingsResult] = await Promise.all([
            supabase.from('cars').select('status', { count: 'exact' }),
            supabase.from('bookings').select('status, total_price', { count: 'exact' })
        ]);

        const totalCars = carsResult.count || 0;
        const availableCars = carsResult.data?.filter(c => c.status === 'available').length || 0;

        const totalBookings = bookingsResult.count || 0;
        const bookings = bookingsResult.data || [];

        const activeBookings = bookings.filter(b => b.status === 'active').length;
        const upcomingBookings = bookings.filter(b => b.status === 'upcoming').length;

        // Calculate total revenue from completed/active bookings
        const totalRevenue = bookings
            .filter(b => b.status === 'completed' || b.status === 'active')
            .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

        return {
            total_cars: totalCars,
            available_cars: availableCars,
            total_bookings: totalBookings,
            active_bookings: activeBookings,
            upcoming_bookings: upcomingBookings,
            total_revenue: totalRevenue
        };
    } catch (error) {
        logError('Error in fetchAdminDashboardStats:', error);
        return {
            total_cars: 0,
            available_cars: 0,
            total_bookings: 0,
            active_bookings: 0,
            upcoming_bookings: 0,
            total_revenue: 0
        };
    }
}

/**
 * Fetch all bookings with car details for admin
 */
export async function fetchAllBookings(): Promise<BookingWithDetails[]> {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                cars (
                    brand,
                    model,
                    image
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            logError('Error fetching all bookings:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        logError('Error in fetchAllBookings:', error);
        return [];
    }
}

/**
 * Fetch all cars for admin
 */
export async function fetchAllCars() {
    try {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            logError('Error fetching all cars:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        logError('Error in fetchAllCars:', error);
        return [];
    }
}

/**
 * Update car status
 */
export async function updateCarStatus(carId: string, status: string) {
    try {
        const { data, error } = await supabase
            .from('cars')
            .update({ status })
            .eq('id', carId)
            .select();

        if (error) {
            logError('Error updating car status:', error);
            throw error;
        }

        return data[0];
    } catch (error) {
        logError('Error in updateCarStatus:', error);
        throw error;
    }
}

/**
 * Delete a car
 */
export async function deleteCar(carId: string) {
    try {
        const { error } = await supabase
            .from('cars')
            .delete()
            .eq('id', carId);

        if (error) {
            logError('Error deleting car:', error);
            throw error;
        }

        logInfo('✅ Car deleted successfully:', carId);
    } catch (error) {
        logError('Error in deleteCar:', error);
        throw error;
    }
}

/**
 * Update booking status (admin)
 */
export async function updateBookingStatusAdmin(bookingId: string, status: 'active' | 'upcoming' | 'completed' | 'cancelled') {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', bookingId)
            .select();

        if (error) {
            logError('Error updating booking status:', error);
            throw error;
        }

        return data[0];
    } catch (error) {
        logError('Error in updateBookingStatusAdmin:', error);
        throw error;
    }
}
