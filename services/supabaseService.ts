import { db } from '@/lib/firebase';
import { collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
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
 * Fetch all cars from Firebase
 */
export async function fetchCars() {
    try {
        const querySnapshot = await getDocs(collection(db, 'cars'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        logWarn('Firebase cars fetch failed:', error);
        return [];
    }
}

/**
 * Fetch bookings for the current user
 */
export async function fetchUserBookings(userId: string) {
    logInfo('🔍 Fetching bookings for user:', userId);
    try {
        const q = query(collection(db, 'bookings'), where('user_id', '==', userId));
        const querySnapshot = await getDocs(q);
        const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

        // Fetch associated cars manually as Firestore is NoSQL
        for (let i = 0; i < bookings.length; i++) {
            const carDoc = await getDoc(doc(db, 'cars', bookings[i].car_id));
            if (carDoc.exists()) {
                bookings[i].cars = { id: carDoc.id, ...carDoc.data() };
            }
        }

        logInfo('✅ Firebase returned:', bookings.length, 'bookings');
        return bookings;
    } catch (error) {
        logError('❌ Firebase error fetching bookings:', error);
        return [];
    }
}

/**
 * Create a new booking in Firebase
 */
export async function createSupabaseBooking(bookingData: Omit<SupabaseBooking, 'id'>) {
    try {
        const docRef = await addDoc(collection(db, 'bookings'), bookingData);
        return { id: docRef.id, ...bookingData };
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId: string, status: SupabaseBooking['status']) {
    try {
        const docRef = doc(db, 'bookings', bookingId);
        await updateDoc(docRef, { status });
        const snapshot = await getDoc(docRef);
        return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
        console.error('Error updating booking status:', error);
        throw error;
    }
}

/**
 * Upsert a car to ensure it exists in Firebase
 */
export async function upsertCar(carData: any) {
    const carId = carData.id;
    if (!carId) throw new Error('Car ID is required for upsert');

    const payload = {
        brand: carData.brand || 'Unknown',
        model: carData.model || 'Premium Model',
        image: carData.image || '',
        price: Number(carData.price) || 0,
        rating: Number(carData.rating) || 4.5,
        fuel_type: carData.fuelType || carData.fuel_type || 'Petrol',
        transmission: carData.transmission || 'Automatic',
        seats: Number(carData.seats) || 5,
        status: carData.status || 'available'
    };

    try {
        await setDoc(doc(db, 'cars', carId), payload, { merge: true });
        return { id: carId, ...payload };
    } catch (error) {
        console.error('Error upserting car:', error);
        throw error;
    }
}

/**
 * Upsert a user in Firebase 
 */
export async function upsertUser(userData: SupabaseUser) {
    if (!userData.id) throw new Error('User ID is required');

    try {
        await setDoc(doc(db, 'users', userData.id), userData, { merge: true });
        return userData;
    } catch (error) {
        console.error('Error upserting user:', error);
        throw error;
    }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
    try {
        const docSnap = await getDoc(doc(db, 'users', userId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        logWarn('User not found:', error);
        return null;
    }
}

/**
 * Create a payment record
 */
export async function createPayment(paymentData: SupabasePayment) {
    try {
        const docRef = await addDoc(collection(db, 'payments'), paymentData);
        return { id: docRef.id, ...paymentData };
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
}

/**
 * Create a vehicle inspection report
 */
export async function createInspection(inspectionData: SupabaseInspection) {
    try {
        const docRef = await addDoc(collection(db, 'inspections'), inspectionData);
        return { id: docRef.id, ...inspectionData };
    } catch (error) {
        console.error('Error creating inspection:', error);
        throw error;
    }
}

/**
 * Add a review for a car
 */
export async function addReview(reviewData: SupabaseReview) {
    try {
        const docRef = await addDoc(collection(db, 'reviews'), {
            ...reviewData,
            created_at: new Date().toISOString()
        });
        return { id: docRef.id, ...reviewData };
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
}

/**
 * Fetch reviews for a specific car
 */
export async function fetchCarReviews(carId: string) {
    try {
        const q = query(
            collection(db, 'reviews'),
            where('car_id', '==', carId)
            // Note: orderBy requires a composite index if used with where
        );
        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

        // Fetch associated users
        for (let i = 0; i < reviews.length; i++) {
            const userDoc = await getDoc(doc(db, 'users', reviews[i].user_id));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                reviews[i].users = { full_name: userData.full_name, avatar_url: userData.avatar_url };
            }
        }

        return reviews.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}
