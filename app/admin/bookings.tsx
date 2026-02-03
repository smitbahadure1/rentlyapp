import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useState, useEffect, useCallback } from 'react';
import { fetchAllBookings, updateBookingStatusAdmin, BookingWithDetails } from '@/services/adminService';

export default function AdminBookingsScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'cancelled'>('all');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const allBookings = await fetchAllBookings();
            setBookings(allBookings);
        } catch (error) {
            console.error('Error loading bookings:', error);
            Alert.alert('Error', 'Failed to load bookings');
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadBookings();
        setRefreshing(false);
    }, []);

    const handleStatusChange = async (bookingId: string, currentStatus: string) => {
        const statusOptions: Array<'active' | 'upcoming' | 'completed' | 'cancelled'> =
            ['active', 'upcoming', 'completed', 'cancelled'];

        Alert.alert(
            'Change Booking Status',
            'Select new status:',
            [
                ...statusOptions.map(status => ({
                    text: status.charAt(0).toUpperCase() + status.slice(1),
                    onPress: async () => {
                        try {
                            await updateBookingStatusAdmin(bookingId, status);
                            await loadBookings();
                            Alert.alert('Success', 'Booking status updated');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to update booking status');
                        }
                    }
                })),
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#00FF00';
            case 'upcoming': return '#00BFFF';
            case 'completed': return '#9CA3AF';
            case 'cancelled': return '#FF4444';
            default: return '#6B7280';
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <SafeAreaView style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Manage Bookings</Text>
                        <Text style={styles.headerSubtitle}>{filteredBookings.length} bookings</Text>
                    </View>
                </View>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterContainer}
                    contentContainerStyle={styles.filterContent}
                >
                    {(['all', 'active', 'upcoming', 'completed', 'cancelled'] as const).map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterTab,
                                filter === status && styles.filterTabActive
                            ]}
                            onPress={() => setFilter(status)}
                        >
                            <Text style={[
                                styles.filterTabText,
                                filter === status && styles.filterTabTextActive
                            ]}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>

            {/* Bookings List */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF00" />
                }
            >
                {filteredBookings.map((booking) => (
                    <View key={booking.id} style={styles.bookingCard}>
                        <View style={styles.bookingHeader}>
                            <View style={styles.carImageContainer}>
                                <Image
                                    source={{ uri: booking.cars.image }}
                                    style={styles.carImage}
                                    contentFit="cover"
                                />
                            </View>

                            <View style={styles.bookingInfo}>
                                <Text style={styles.carName}>
                                    {booking.cars.brand} {booking.cars.model}
                                </Text>
                                <View style={styles.bookingMeta}>
                                    <Ionicons name="person-outline" size={14} color="#6B7280" />
                                    <Text style={styles.metaText}>{booking.user_id.substring(0, 8)}...</Text>
                                </View>
                            </View>

                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: `${getStatusColor(booking.status)}20` }
                            ]}>
                                <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                                    {booking.status.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.bookingDetails}>
                            <View style={styles.detailRow}>
                                <View style={styles.detailItem}>
                                    <Ionicons name="calendar-outline" size={16} color="#00FF00" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Start Date</Text>
                                        <Text style={styles.detailValue}>{formatDate(booking.start_date)}</Text>
                                    </View>
                                </View>
                                <View style={styles.detailItem}>
                                    <Ionicons name="calendar-outline" size={16} color="#FF4444" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>End Date</Text>
                                        <Text style={styles.detailValue}>{formatDate(booking.end_date)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <View style={styles.detailItem}>
                                    <Ionicons name="location-outline" size={16} color="#00BFFF" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Pickup</Text>
                                        <Text style={styles.detailValue} numberOfLines={1}>
                                            {booking.pickup_location}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <View style={styles.detailItem}>
                                    <Ionicons name="location-outline" size={16} color="#FFD700" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Drop-off</Text>
                                        <Text style={styles.detailValue} numberOfLines={1}>
                                            {booking.drop_location}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.bookingFooter}>
                            <View style={styles.priceContainer}>
                                <Text style={styles.priceLabel}>Total Price</Text>
                                <Text style={styles.priceValue}>₹{booking.total_price.toLocaleString()}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => handleStatusChange(booking.id, booking.status)}
                            >
                                <Ionicons name="create-outline" size={18} color="#00FF00" />
                                <Text style={styles.actionBtnText}>Change Status</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {filteredBookings.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="document-text-outline" size={64} color="#27272A" />
                        <Text style={styles.emptyText}>No bookings found</Text>
                        <Text style={styles.emptySubtext}>
                            {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
                        </Text>
                    </View>
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
    header: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 28,
        fontFamily: 'Inter_900Black',
        letterSpacing: -1,
    },
    headerSubtitle: {
        color: '#9CA3AF',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        marginTop: 4,
    },
    filterContainer: {
        marginTop: 8,
    },
    filterContent: {
        gap: 8,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#27272A',
    },
    filterTabActive: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderColor: 'rgba(0, 255, 0, 0.3)',
    },
    filterTabText: {
        color: '#6B7280',
        fontSize: 13,
        fontFamily: 'Inter_600SemiBold',
    },
    filterTabTextActive: {
        color: '#00FF00',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    bookingCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#27272A',
        overflow: 'hidden',
    },
    bookingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#27272A',
    },
    carImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#27272A',
        marginRight: 12,
    },
    carImage: {
        width: '100%',
        height: '100%',
    },
    bookingInfo: {
        flex: 1,
    },
    carName: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
        marginBottom: 4,
    },
    bookingMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 1,
    },
    bookingDetails: {
        padding: 16,
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        gap: 12,
    },
    detailItem: {
        flex: 1,
        flexDirection: 'row',
        gap: 8,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        color: '#6B7280',
        fontSize: 11,
        fontFamily: 'Inter_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    detailValue: {
        color: '#FFF',
        fontSize: 13,
        fontFamily: 'Inter_600SemiBold',
    },
    bookingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#27272A',
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        color: '#6B7280',
        fontSize: 11,
        fontFamily: 'Inter_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    priceValue: {
        color: '#00FF00',
        fontSize: 20,
        fontFamily: 'Inter_900Black',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 0, 0.3)',
    },
    actionBtnText: {
        color: '#00FF00',
        fontSize: 13,
        fontFamily: 'Inter_700Bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        color: '#FFF',
        fontSize: 20,
        fontFamily: 'Inter_700Bold',
        marginTop: 16,
    },
    emptySubtext: {
        color: '#6B7280',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
        marginTop: 8,
    },
});
