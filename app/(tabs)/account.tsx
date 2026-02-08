import { fetchUserBookings } from '@/services/supabaseService';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
                            colors={['#2A2A2E', '#141414', '#000']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.8, y: 1 }}
                            style={styles.membershipCard}
                        >
                            {/* Decorative Elements */}
                            <View style={styles.cardPatternCircle} />
                            <View style={styles.cardPatternLine} />

                            {/* Card Content */}
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    {/* Chip Icon */}
                                    <View style={styles.chipIcon}>
                                        <View style={styles.chipLine} />
                                        <View style={[styles.chipLine, { left: 8 }]} />
                                        <View style={[styles.chipLine, { left: 16 }]} />
                                        <View style={[styles.chipLine, { top: '50%', height: 1, width: '100%' }]} />
                                    </View>

                                    <View style={styles.memberBadge}>
                                        <Text style={styles.memberBadgeText}>BLACK TIER</Text>
                                    </View>
                                </View>

                                <View style={styles.middleSection}>
                                    <View style={styles.avatarContainer}>
                                        {user?.imageUrl ? (
                                            <Image
                                                source={{ uri: user.imageUrl }}
                                                style={styles.avatarImage}
                                                contentFit="cover"
                                                transition={200}
                                            />
                                        ) : (
                                            <View style={[styles.avatarImage, { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }]}>
                                                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>
                                                    {displayName.charAt(0)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.userName}>{displayName}</Text>
                                        <Text style={styles.userSince}>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2025'}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.pointsRow}>
                                            <Text style={styles.pointsLabel}>RENTLY POINTS</Text>
                                            <Text style={styles.pointsValue}>12,450</Text>
                                        </View>
                                        {/* Progress Bar */}
                                        <View style={styles.progressBarBg}>
                                            <View style={[styles.progressBarFill, { width: '75%' }]} />
                                        </View>
                                        <Text style={styles.progressText}>3,550 pts to Diamond</Text>
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
                                onPress={() => {
                                    if (item.id === 'settings') {
                                        // router.push('/settings' as any); // Example route
                                    } else {
                                        // router.push(`/settings/${item.id}` as any);
                                    }
                                }}
                            >
                                <View style={styles.menuLeft}>
                                    <View style={styles.menuIconBox}>
                                        <Ionicons name={item.icon as any} size={20} color="#FFF" />
                                    </View>
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
        </View >
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
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#333',
    },
    cardPatternCircle: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 40,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    cardPatternLine: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '40%',
        backgroundColor: 'rgba(255,255,255,0.02)',
        transform: [{ skewY: '-10deg' }],
    },
    cardContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    chipIcon: {
        width: 40,
        height: 30,
        borderRadius: 6,
        backgroundColor: '#D4AF37', // Gold-ish
        overflow: 'hidden',
        position: 'relative',
        opacity: 0.9,
    },
    chipLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    memberBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    memberBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 1,
    },
    middleSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFF',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    userName: {
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
        marginBottom: 2,
    },
    userSince: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Inter_500Medium',
    },
    cardFooter: {
        marginTop: 10,
    },
    pointsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    pointsLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: 1,
    },
    pointsValue: {
        fontSize: 16,
        fontFamily: 'Inter_800ExtraBold',
        color: '#FFF',
    },
    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        width: '100%',
        marginBottom: 6,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 10,
        color: '#9CA3AF',
        fontFamily: 'Inter_500Medium',
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
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    menuText: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: '#FFF',
    },
    logoutButton: {
        marginHorizontal: 20,
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // Light red bg
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
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
        fontFamily: 'Inter_500Medium',
    },
});
