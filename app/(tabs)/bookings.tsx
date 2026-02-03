import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { fetchUserBookings } from '@/services/supabaseService';

export default function BookingsScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('Active');
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const TABS = ['Active', 'Upcoming', 'History'];

    useEffect(() => {
        async function loadBookings() {
            if (!user) {
                console.log('⚠️ No user found, skipping booking fetch');
                return;
            }
            try {
                console.log('👤 Current user ID:', user.id);
                // Only show loader on initial mount or major refresh
                if (refreshTrigger === 0) setIsLoading(true);
                const data = await fetchUserBookings(user.id);
                console.log('📋 Fetched bookings:', JSON.stringify(data, null, 2));
                console.log('📋 Number of bookings:', data?.length || 0);
                if (data && data.length > 0) {
                    console.log('✅ First booking:', data[0]);
                } else {
                    console.log('❌ No bookings returned from Supabase');
                }
                setBookings(data || []);
            } catch (error) {
                console.error('❌ Error loading bookings:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadBookings();

        // Refresh periodically or on tab focus could be added here
        // For now, we'll use a simple interval or rely on the checkout redirect
        const interval = setInterval(loadBookings, 10000); // Polling every 10s as a fallback
        return () => clearInterval(interval);
    }, [user, refreshTrigger]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#10B981';
            case 'upcoming': return '#3B82F6';
            case 'completed': return '#9CA3AF';
            case 'cancelled': return '#EF4444';
            default: return '#FFF';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'On Trip';
            case 'upcoming': return 'Confirmed';
            case 'completed': return 'Completed';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    const filteredBookings = bookings.filter(item => {
        if (activeTab === 'Active') return item.status === 'active';
        if (activeTab === 'Upcoming') return item.status === 'upcoming';
        if (activeTab === 'History') return item.status === 'completed' || item.status === 'cancelled';
        return true;
    });

    console.log(`🔍 Active tab: "${activeTab}", Filtered bookings: ${filteredBookings.length}`);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <Text style={styles.headerTitle}>Bookings</Text>

                <View style={styles.tabContainer}>
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {isLoading ? (
                    <View style={styles.emptyState}>
                        <ActivityIndicator size="large" color="#FFF" />
                    </View>
                ) : filteredBookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={64} color="#333" />
                        <Text style={styles.emptyTitle}>No {activeTab} Bookings</Text>
                        <Text style={styles.emptySubtitle}>
                            When you book an elite ride, it will appear here for you to manage.
                        </Text>
                    </View>
                ) : (
                    filteredBookings.map((item) => (
                        <View key={item.id} style={styles.ticketCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.refText}>{item.id.slice(0, 8).toUpperCase()}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                                        {getStatusText(item.status)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.mainInfo}>
                                <Image source={{ uri: item.cars?.image }} style={styles.carImage} contentFit="contain" />
                                <View style={styles.infoCol}>
                                    <Text style={styles.carName}>{item.cars?.brand} {item.cars?.model}</Text>
                                    <View style={styles.detailsRow}>
                                        <View style={styles.detailItem}>
                                            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                                            <Text style={styles.detailText}>{new Date(item.start_date).toLocaleDateString()}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                                            <Text style={styles.detailText}>10:00 AM</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.footerRow}>
                                <View>
                                    <Text style={styles.priceLabel}>TOTAL PRICE</Text>
                                    <Text style={styles.priceValue}>₹ {item.total_price.toLocaleString()}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.manageBtn}
                                    onPress={() => router.push({ pathname: "/car/[id]", params: { id: item.car_id } } as any)}
                                >
                                    <Text style={styles.manageBtnText}>Manage</Text>
                                    <Ionicons name="chevron-forward" size={14} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    safeArea: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: 'Inter_800ExtraBold',
        color: '#FFF',
        marginTop: 10,
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 4,
        marginBottom: 10,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTabButton: {
        backgroundColor: '#333',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        color: '#9CA3AF',
    },
    activeTabText: {
        color: '#FFF',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
    ticketCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    refText: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Inter_800ExtraBold',
        textTransform: 'uppercase',
    },
    mainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    carImage: {
        width: 100,
        height: 60,
        marginRight: 15,
    },
    infoCol: {
        flex: 1,
    },
    carName: {
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
        marginBottom: 6,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 15,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 20,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        color: '#6B7280',
        fontSize: 10,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 1,
    },
    priceValue: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Inter_800ExtraBold',
        marginTop: 2,
    },
    manageBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    manageBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
    },
});
