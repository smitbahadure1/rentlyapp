import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useCallback } from 'react';
import { fetchAdminDashboardStats, AdminDashboardStats } from '@/services/adminService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboardScreen() {
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
    const [adminName, setAdminName] = useState('Admin');

    useEffect(() => {
        checkAdminAuth();
        loadDashboardData();
    }, []);

    const checkAdminAuth = async () => {
        try {
            const adminUser = await AsyncStorage.getItem('admin_user');
            if (!adminUser) {
                router.replace('/admin-sign-in' as any);
            } else {
                const user = JSON.parse(adminUser);
                setAdminName(user.full_name || 'Admin');
            }
        } catch (error) {
            console.error('Error checking admin auth:', error);
            router.replace('/admin-sign-in' as any);
        }
    };

    const loadDashboardData = async () => {
        try {
            const dashboardStats = await fetchAdminDashboardStats();
            setStats(dashboardStats);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadDashboardData();
        setRefreshing(false);
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem('admin_user');
                        router.replace('/admin-sign-in' as any);
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <LinearGradient
                colors={['#1a1a1a', '#000000']}
                style={styles.header}
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.headerContent}>
                        <View>
                            <View style={styles.adminBadge}>
                                <Ionicons name="shield-checkmark" size={16} color="#FFF" />
                                <Text style={styles.adminBadgeText}>ADMIN</Text>
                            </View>
                            <Text style={styles.headerTitle}>Dashboard</Text>
                            <Text style={styles.headerSubtitle}>Welcome back, {adminName}</Text>
                        </View>
                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />
                }
            >
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Ionicons name="car-sport" size={32} color="#FFF" />
                        <Text style={styles.statValue}>{stats.total_cars}</Text>
                        <Text style={styles.statLabel}>Total Cars</Text>
                        <Text style={styles.statSubtext}>{stats.available_cars} available</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="calendar" size={32} color="#FFF" />
                        <Text style={styles.statValue}>{stats.total_bookings}</Text>
                        <Text style={styles.statLabel}>Total Bookings</Text>
                        <Text style={styles.statSubtext}>{stats.active_bookings} active</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="time" size={32} color="#FFF" />
                        <Text style={styles.statValue}>{stats.upcoming_bookings}</Text>
                        <Text style={styles.statLabel}>Upcoming</Text>
                        <Text style={styles.statSubtext}>Next rentals</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="cash" size={32} color="#FFF" />
                        <Text style={styles.statValue}>₹{stats.total_revenue.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>Revenue</Text>
                        <Text style={styles.statSubtext}>Total earned</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/admin/cars' as any)}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="car-sport-outline" size={24} color="#FFF" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Manage Cars</Text>
                            <Text style={styles.actionSubtitle}>View, edit, and manage all vehicles</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#6B7280" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/admin/bookings' as any)}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="document-text-outline" size={24} color="#FFF" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Manage Bookings</Text>
                            <Text style={styles.actionSubtitle}>Track all rentals and reservations</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#6B7280" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push('/admin/analytics' as any)}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="analytics-outline" size={24} color="#FFF" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Analytics</Text>
                            <Text style={styles.actionSubtitle}>View detailed reports and insights</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#6B7280" />
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
    header: {
        paddingBottom: 20,
    },
    safeArea: {
        paddingHorizontal: 24,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 10,
    },
    adminBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 12,
    },
    adminBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 1.2,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 32,
        fontFamily: 'Inter_900Black',
        letterSpacing: -1,
        marginBottom: 4,
    },
    headerSubtitle: {
        color: '#9CA3AF',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    logoutBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        width: '47%',
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    statValue: {
        color: '#FFF',
        fontSize: 28,
        fontFamily: 'Inter_900Black',
        marginTop: 12,
        marginBottom: 4,
    },
    statLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: 0.5,
    },
    statSubtext: {
        color: '#6B7280',
        fontSize: 11,
        fontFamily: 'Inter_500Medium',
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#9CA3AF',
        fontSize: 11,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 2,
        marginBottom: 16,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
        marginBottom: 4,
    },
    actionSubtitle: {
        color: '#6B7280',
        fontSize: 13,
        fontFamily: 'Inter_500Medium',
    },
});
