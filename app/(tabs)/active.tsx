import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { storeCarData } from '@/services/carDataStore';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

import { fetchUserBookings } from '@/services/supabaseService';
import { useUser } from '@clerk/clerk-expo';
import { useState } from 'react';

export default function ActiveTabScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [activeBooking, setActiveBooking] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadActiveBooking() {
            if (!user) return;
            try {
                setIsLoading(true);
                const bookings = await fetchUserBookings(user.id);
                // Find the first active booking
                const active = bookings?.find(b => b.status === 'active');
                if (active) {
                    setActiveBooking(active);
                    storeCarData(active.car_id, active.cars);
                }
            } catch (error) {
                console.error('Error loading active booking:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadActiveBooking();
    }, [user]);

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        );
    }

    if (!activeBooking) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.header}>
                    <Text style={styles.headerTitle}>Active Trip</Text>
                </SafeAreaView>
                <View style={[styles.emptyState, { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
                    <Ionicons name="car-sport-outline" size={80} color="#333" />
                    <Text style={{ color: '#FFF', fontSize: 20, fontFamily: 'Inter_700Bold', marginTop: 20 }}>No Active Trip</Text>
                    <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 10 }}>Your elite journey will appear here once you start your ride.</Text>
                    <TouchableOpacity
                        style={{ backgroundColor: '#FFF', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30, marginTop: 30 }}
                        onPress={() => router.push('/(tabs)/home')}
                    >
                        <Text style={{ color: '#000', fontWeight: '800' }}>Find a Car</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const ACTIVE_CAR = {
        id: activeBooking.car_id,
        brand: activeBooking.cars?.brand || 'Premium',
        model: activeBooking.cars?.model || 'Model',
        image: activeBooking.cars?.image,
        status: 'Active Trip',
        ref: activeBooking.id.slice(0, 8).toUpperCase(),
        location: activeBooking.pickup_location,
        fuel: '84%',
        range: '432 km',
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Control Centre</Text>
                    <TouchableOpacity style={styles.sosBadge}>
                        <Text style={styles.sosText}>sos</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Active Car Section */}
                <Animated.View entering={FadeInUp.delay(100)} style={styles.activeCard}>
                    <View style={styles.carHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.carTitle}>{ACTIVE_CAR.brand} {ACTIVE_CAR.model}</Text>
                            <Text style={styles.carRef}>{ACTIVE_CAR.ref}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>READY FOR PICKUP</Text>
                        </View>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image source={{ uri: ACTIVE_CAR.image }} style={styles.carImage} contentFit="contain" />
                    </View>

                    <View style={styles.activeDivider} />

                    <View style={styles.telemeticsSummary}>
                        <View style={styles.teleItem}>
                            <Ionicons name="filter-outline" size={18} color="#D1D5DB" />
                            <Text style={styles.teleText}>{ACTIVE_CAR.fuel}</Text>
                        </View>
                        <View style={styles.teleItem}>
                            <Ionicons name="speedometer-outline" size={18} color="#D1D5DB" />
                            <Text style={styles.teleText}>{ACTIVE_CAR.range}</Text>
                        </View>
                        <View style={styles.teleItem}>
                            <Ionicons name="location-outline" size={18} color="#D1D5DB" />
                            <Text style={styles.teleText} numberOfLines={1}>Elite Hub</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Workflow Steps - THE CORE REQUEST */}
                <Text style={styles.sectionTitle}>Required Steps</Text>

                <View style={styles.workflowContainer}>
                    {/* Stage 1: Inspection */}
                    <TouchableOpacity
                        style={styles.stepItem}
                        activeOpacity={0.7}
                        onPress={() => router.push(`/inspection/${ACTIVE_CAR.id}` as any)}
                    >
                        <View style={styles.stepIconBox}>
                            <Ionicons name="scan-outline" size={24} color="#FFF" />
                        </View>
                        <View style={styles.stepInfo}>
                            <Text style={styles.stepTitle}>360° Virtual Inspection</Text>
                            <Text style={styles.stepDesc}>Mandatory before engine unlock</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#333" />
                    </TouchableOpacity>

                    {/* Stage 2: Dashboard/Engine Control */}
                    <TouchableOpacity
                        style={styles.stepItem}
                        activeOpacity={0.7}
                        onPress={() => router.push(`/active-trip/${ACTIVE_CAR.id}` as any)}
                    >
                        <View style={[styles.stepIconBox, { backgroundColor: '#1C1C1E' }]}>
                            <Ionicons name="power" size={24} color="#FFF" />
                        </View>
                        <View style={styles.stepInfo}>
                            <Text style={styles.stepTitle}>Engine Start & Dashboard</Text>
                            <Text style={styles.stepDesc}>Remotely control your luxury fleet</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#333" />
                    </TouchableOpacity>

                    {/* Stage 3: Return/Review (Future/Simulated) */}
                    <TouchableOpacity
                        style={[styles.stepItem, { opacity: 0.5 }]}
                        activeOpacity={1}
                    >
                        <View style={[styles.stepIconBox, { backgroundColor: '#1C1C1E' }]}>
                            <Ionicons name="star-outline" size={24} color="#FFF" />
                        </View>
                        <View style={styles.stepInfo}>
                            <Text style={styles.stepTitle}>Trip Review</Text>
                            <Text style={styles.stepDesc}>Rate your elite experience</Text>
                        </View>
                        <Ionicons name="lock-closed" size={16} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Quick Shortcuts */}
                <Text style={styles.sectionTitle}>Support & Assistance</Text>
                <View style={styles.supportGrid}>
                    <TouchableOpacity style={styles.supportCard}>
                        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFF" />
                        <Text style={styles.supportLabel}>Concierge</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.supportCard}>
                        <Ionicons name="document-text-outline" size={24} color="#FFF" />
                        <Text style={styles.supportLabel}>Documents</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        color: '#6B7280',
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 48,
        fontFamily: 'Inter_900Black',
        color: '#FFF',
        letterSpacing: -2,
    },
    sosBadge: {
        backgroundColor: '#F34444',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
    },
    sosText: {
        color: '#FFF',
        fontFamily: 'Inter_900Black',
        fontSize: 22,
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingBottom: 100,
        paddingTop: 10,
    },
    activeCard: {
        backgroundColor: '#1E1E1E',
        marginHorizontal: 16,
        borderRadius: 40,
        padding: 30,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        marginBottom: 32,
    },
    carHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    carTitle: {
        color: '#FFF',
        fontSize: 28,
        fontFamily: 'Inter_900Black',
        letterSpacing: -0.5,
    },
    carRef: {
        color: '#6B7280',
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        marginTop: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    statusText: {
        color: '#10B981',
        fontSize: 11,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 0.5,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    carImage: {
        width: '100%',
        height: '100%',
    },
    activeDivider: {
        height: 1,
        backgroundColor: '#333',
        width: '100%',
        marginVertical: 20,
    },
    telemeticsSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    teleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    teleText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        marginLeft: 24,
        marginBottom: 16,
    },
    workflowContainer: {
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 32,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#27272A',
        gap: 16,
    },
    stepIconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    stepInfo: {
        flex: 1,
    },
    stepTitle: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    stepDesc: {
        color: '#9CA3AF',
        fontSize: 13,
        fontFamily: 'Inter_500Medium',
        marginTop: 2,
    },
    supportGrid: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
    },
    supportCard: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#27272A',
        gap: 10,
    },
    supportLabel: {
        color: '#9CA3AF',
        fontSize: 13,
        fontFamily: 'Inter_600SemiBold',
    }
});
