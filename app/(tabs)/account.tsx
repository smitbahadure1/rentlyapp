import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useState, useEffect } from 'react';
import { fetchUserBookings } from '@/services/supabaseService';

const { width } = Dimensions.get('window');

// Mock Data
const MENU_ITEMS = [
    { id: 'personal', icon: 'person-outline', label: 'Personal Information' },
    { id: 'security', icon: 'shield-checkmark-outline', label: 'Login & Security' },
    { id: 'payments', icon: 'card-outline', label: 'Payments & Payouts' },
    { id: 'settings', icon: 'settings-outline', label: 'Settings' },
];

export default function AccountScreen() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const { signOut } = useAuth();
    const [tripCount, setTripCount] = useState(0);

    useEffect(() => {
        async function loadTripCount() {
            if (!user) return;
            try {
                const bookings = await fetchUserBookings(user.id);
                setTripCount(bookings?.length || 0);
            } catch (error) {
                console.error('Error loading trip count:', error);
            }
        }
        loadTripCount();
    }, [user]);

    const handleLogout = async () => {
        await signOut();
        router.replace('/');
    };

    if (!isLoaded) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        );
    }

    // Properly format the display name (Capitalize and split)
    const rawName = user?.fullName || user?.emailAddresses[0]?.emailAddress.split('@')[0] || 'Member';
    const displayName = rawName.split(/[-_.]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Account</Text>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/settings/notifications' as any)}>
                        <Ionicons name="notifications-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Elite VIP Digital Pass */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.membershipCardWrapper}
                        onPress={() => router.push('/settings/membership' as any)}
                    >
                        <LinearGradient
                            colors={['#1a1a1a', '#000000', '#1a1a1a']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.membershipCard}
                        >
                            {/* Holographic Patterns */}
                            <View style={styles.cardPattern} />
                            <View style={[styles.cardPattern, { bottom: -50, right: -50, opacity: 0.1, backgroundColor: '#FFF' }]} />

                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.avatarContainer}>
                                        <View style={styles.avatarGlow} />
                                        <View style={styles.avatarBorder}>
                                            <View style={styles.avatar}>
                                                {user?.imageUrl ? (
                                                    <Image
                                                        source={{ uri: user.imageUrl }}
                                                        style={styles.avatarImage}
                                                        contentFit="cover"
                                                    />
                                                ) : (
                                                    <Ionicons name="person" size={32} color="#000" />
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.memberBadge}>
                                        <Ionicons name="diamond" size={14} color="#000" />
                                        <Text style={styles.memberBadgeText}>BLACK TIER</Text>
                                    </View>
                                </View>

                                <View style={styles.userDetails}>
                                    <Text style={[styles.userName, displayName.length > 15 && { fontSize: 22 }]}>
                                        {displayName}
                                    </Text>
                                    <View style={styles.memberSinceRow}>
                                        <View style={styles.statusDot} />
                                        <Text style={styles.userSince}>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</Text>
                                    </View>
                                </View>

                                <View style={styles.pointsRow}>
                                    <View>
                                        <Text style={styles.pointsLabel}>RENTLY POINTS</Text>
                                        <Text style={styles.pointsValue}>12,450</Text>
                                    </View>
                                    <View style={styles.benefitTag}>
                                        <Text style={styles.benefitTagText}>View Benefits</Text>
                                        <Ionicons name="chevron-forward" size={12} color="#000" />
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Dashboard Grid */}
                    <View style={styles.statsGrid}>
                        <TouchableOpacity style={styles.statBox} onPress={() => router.push('/(tabs)/bookings')}>
                            <Text style={styles.statNumber}>{tripCount}</Text>
                            <Text style={styles.statLabel}>Trips</Text>
                        </TouchableOpacity>
                        <View style={styles.verticalDivider} />
                        <TouchableOpacity style={styles.statBox}>
                            <Text style={styles.statNumber}>4.9</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </TouchableOpacity>
                        <View style={styles.verticalDivider} />
                        <TouchableOpacity style={styles.statBox}>
                            <Text style={styles.statNumber}>8</Text>
                            <Text style={styles.statLabel}>Vouchers</Text>
                        </TouchableOpacity>
                    </View>


                    {/* Menu List */}
                    <View style={styles.menuSection}>
                        {MENU_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuRow}
                                onPress={() => router.push(`/settings/${item.id}` as any)}
                            >
                                <View style={styles.menuLeft}>
                                    <Ionicons name={item.icon as any} size={22} color="#D1D5DB" />
                                    <Text style={styles.menuText}>{item.label}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#4B5563" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>

                    <Text style={styles.version}>Rently v4.2.0 (Premium)</Text>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 34,
        fontFamily: 'Inter_800ExtraBold',
        color: '#FFF',
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    membershipCardWrapper: {
        marginHorizontal: 20,
        marginBottom: 32,
    },
    membershipCard: {
        height: 220,
        borderRadius: 30,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#333',
    },
    cardPattern: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#27272A',
        opacity: 0.5,
    },
    cardContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2,
    },
    avatarContainer: {
        width: 72,
        height: 72,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarGlow: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatarBorder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        backgroundColor: '#000',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    memberBadge: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    memberBadgeText: {
        color: '#000',
        fontSize: 11,
        fontFamily: 'Inter_900Black',
        letterSpacing: 1.5,
    },
    userDetails: {
        marginVertical: 15,
        zIndex: 2,
    },
    userName: {
        fontSize: 32,
        fontFamily: 'Inter_900Black',
        color: '#FFF',
        letterSpacing: -1,
    },
    memberSinceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4ade80',
    },
    userSince: {
        fontSize: 14,
        color: '#9CA3AF',
        fontFamily: 'Inter_500Medium',
    },
    pointsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        zIndex: 2,
    },
    pointsLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 1.5,
    },
    pointsValue: {
        fontSize: 28,
        fontFamily: 'Inter_900Black',
        color: '#FFF',
        marginTop: 2,
    },
    benefitTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 30,
    },
    benefitTagText: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'Inter_800ExtraBold',
    },
    statsGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        paddingVertical: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#333',
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontFamily: 'Inter_800ExtraBold',
        color: '#FFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Inter_600SemiBold',
        marginTop: 4,
    },
    verticalDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
        marginLeft: 24,
        marginBottom: 16,
    },
    menuSection: {
        marginHorizontal: 20,
        marginBottom: 32,
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1C1C1E',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuText: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#FFF',
    },
    logoutButton: {
        marginHorizontal: 20,
        backgroundColor: '#1C1C1E',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    version: {
        textAlign: 'center',
        color: '#4B5563',
        fontSize: 12,
        marginBottom: 20,
    },
});
