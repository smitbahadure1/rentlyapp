import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { fetchAdminDashboardStats, fetchAllBookings, AdminDashboardStats } from '@/services/adminService';

export default function AdminAnalyticsScreen() {
    const router = useRouter();
    const [stats, setStats] = useState<AdminDashboardStats>({
        total_cars: 0,
        available_cars: 0,
        total_bookings: 0,
        active_bookings: 0,
        upcoming_bookings: 0,
        total_revenue: 0
    });
    const [refreshing, setRefreshing] = useState(false);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const dashboardStats = await fetchAdminDashboardStats();
            setStats(dashboardStats);

            const bookings = await fetchAllBookings();
            setRecentActivity(bookings.slice(0, 5));
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadAnalytics();
        setRefreshing(false);
    }, []);

    const utilizationRate = stats.total_cars > 0
        ? ((stats.total_cars - stats.available_cars) / stats.total_cars * 100).toFixed(1)
        : '0';

    const avgRevenuePerBooking = stats.total_bookings > 0
        ? (stats.total_revenue / stats.total_bookings).toFixed(0)
        : '0';

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
                        <Text style={styles.headerTitle}>Analytics</Text>
                        <Text style={styles.headerSubtitle}>Business insights & metrics</Text>
                    </View>
                </View>
            </SafeAreaView>

            {/* Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF00" />
                }
            >
                {/* Key Metrics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>KEY METRICS</Text>

                    <View style={styles.metricsGrid}>
                        <View style={styles.metricCard}>
                            <View style={styles.metricHeader}>
                                <Ionicons name="trending-up" size={24} color="#00FF00" />
                                <Text style={styles.metricValue}>{utilizationRate}%</Text>
                            </View>
                            <Text style={styles.metricLabel}>Fleet Utilization</Text>
                            <Text style={styles.metricSubtext}>
                                {stats.total_cars - stats.available_cars} of {stats.total_cars} cars in use
                            </Text>
                        </View>

                        <View style={styles.metricCard}>
                            <View style={styles.metricHeader}>
                                <Ionicons name="cash" size={24} color="#00FF88" />
                                <Text style={styles.metricValue}>₹{avgRevenuePerBooking}</Text>
                            </View>
                            <Text style={styles.metricLabel}>Avg Revenue/Booking</Text>
                            <Text style={styles.metricSubtext}>
                                From {stats.total_bookings} total bookings
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Revenue Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>REVENUE OVERVIEW</Text>

                    <View style={styles.revenueCard}>
                        <View style={styles.revenueHeader}>
                            <Text style={styles.revenueTitle}>Total Revenue</Text>
                            <Text style={styles.revenueAmount}>₹{stats.total_revenue.toLocaleString()}</Text>
                        </View>

                        <View style={styles.revenueBreakdown}>
                            <View style={styles.revenueItem}>
                                <View style={styles.revenueItemHeader}>
                                    <Ionicons name="checkmark-circle" size={20} color="#00FF00" />
                                    <Text style={styles.revenueItemLabel}>Active Rentals</Text>
                                </View>
                                <Text style={styles.revenueItemValue}>{stats.active_bookings}</Text>
                            </View>

                            <View style={styles.revenueItem}>
                                <View style={styles.revenueItemHeader}>
                                    <Ionicons name="time" size={20} color="#00BFFF" />
                                    <Text style={styles.revenueItemLabel}>Upcoming Rentals</Text>
                                </View>
                                <Text style={styles.revenueItemValue}>{stats.upcoming_bookings}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Fleet Status */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>FLEET STATUS</Text>

                    <View style={styles.fleetCard}>
                        <View style={styles.fleetRow}>
                            <View style={styles.fleetItem}>
                                <View style={[styles.fleetIndicator, { backgroundColor: '#00FF00' }]} />
                                <Text style={styles.fleetLabel}>Available</Text>
                            </View>
                            <Text style={styles.fleetValue}>{stats.available_cars}</Text>
                        </View>

                        <View style={styles.fleetRow}>
                            <View style={styles.fleetItem}>
                                <View style={[styles.fleetIndicator, { backgroundColor: '#FF4444' }]} />
                                <Text style={styles.fleetLabel}>In Use</Text>
                            </View>
                            <Text style={styles.fleetValue}>{stats.total_cars - stats.available_cars}</Text>
                        </View>

                        <View style={styles.fleetRow}>
                            <View style={styles.fleetItem}>
                                <View style={[styles.fleetIndicator, { backgroundColor: '#00BFFF' }]} />
                                <Text style={styles.fleetLabel}>Total Fleet</Text>
                            </View>
                            <Text style={styles.fleetValue}>{stats.total_cars}</Text>
                        </View>
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>

                    {recentActivity.map((booking, index) => (
                        <View key={booking.id} style={styles.activityCard}>
                            <View style={styles.activityIcon}>
                                <Ionicons name="document-text" size={20} color="#00FF00" />
                            </View>
                            <View style={styles.activityContent}>
                                <Text style={styles.activityTitle}>
                                    {booking.cars?.brand} {booking.cars?.model}
                                </Text>
                                <Text style={styles.activitySubtitle}>
                                    {booking.status} • ₹{booking.total_price}
                                </Text>
                            </View>
                            <Text style={styles.activityTime}>
                                {new Date(booking.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </Text>
                        </View>
                    ))}

                    {recentActivity.length === 0 && (
                        <View style={styles.emptyActivity}>
                            <Text style={styles.emptyText}>No recent activity</Text>
                        </View>
                    )}
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
    header: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
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
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        color: '#00FF00',
        fontSize: 11,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 2,
        marginBottom: 16,
    },
    metricsGrid: {
        gap: 16,
    },
    metricCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    metricValue: {
        color: '#FFF',
        fontSize: 32,
        fontFamily: 'Inter_900Black',
    },
    metricLabel: {
        color: '#9CA3AF',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 4,
    },
    metricSubtext: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    revenueCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    revenueHeader: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#27272A',
    },
    revenueTitle: {
        color: '#9CA3AF',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    revenueAmount: {
        color: '#00FF88',
        fontSize: 36,
        fontFamily: 'Inter_900Black',
    },
    revenueBreakdown: {
        gap: 16,
    },
    revenueItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    revenueItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    revenueItemLabel: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
    revenueItemValue: {
        color: '#9CA3AF',
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
    },
    fleetCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#27272A',
        gap: 16,
    },
    fleetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fleetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    fleetIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    fleetLabel: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
    fleetValue: {
        color: '#9CA3AF',
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter_700Bold',
        marginBottom: 2,
    },
    activitySubtitle: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    activityTime: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
    },
    emptyActivity: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
});
