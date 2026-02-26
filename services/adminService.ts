import { db } from '@/lib/firebase';
import { collection, doc, getDocs, getDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
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
 */
export async function adminSignIn(email: string, password: string): Promise<AdminUser | null> {
    try {
        if (email === 'justme13680@gmail.com' && password === 'Aditya1234') {
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
export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
    try {
        const carsSnapshot = await getDocs(collection(db, 'cars'));
        const bookingsSnapshot = await getDocs(collection(db, 'bookings'));

        let available_cars = 0;
        carsSnapshot.docs.forEach(doc => {
            if (doc.data().status === 'available') available_cars++;
        });

        let active_bookings = 0;
        let upcoming_bookings = 0;
        let total_revenue = 0;

        bookingsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.status === 'active') active_bookings++;
            if (data.status === 'upcoming') upcoming_bookings++;
            total_revenue += (data.total_price || 0);
        });

        return {
            total_cars: carsSnapshot.size,
            available_cars,
            total_bookings: bookingsSnapshot.size,
            active_bookings,
            upcoming_bookings,
            total_revenue
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
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        const bookings = [];

        for (const docSnapshot of querySnapshot.docs) {
            const data = docSnapshot.data();
            const carDoc = await getDoc(doc(db, 'cars', data.car_id));
            if (carDoc.exists()) {
                const carData = carDoc.data();
                data.cars = { brand: carData.brand, model: carData.model, image: carData.image };
            }
            bookings.push({ id: docSnapshot.id, ...data } as BookingWithDetails);
        }

        return bookings.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
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
        const querySnapshot = await getDocs(collection(db, 'cars'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        const docRef = doc(db, 'cars', carId);
        await updateDoc(docRef, { status });
        const snapshot = await getDoc(docRef);
        return { id: snapshot.id, ...snapshot.data() };
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
        await deleteDoc(doc(db, 'cars', carId));
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
        const docRef = doc(db, 'bookings', bookingId);
        await updateDoc(docRef, { status });
        const snapshot = await getDoc(docRef);
        return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
        logError('Error in updateBookingStatusAdmin:', error);
        throw error;
    }
}
