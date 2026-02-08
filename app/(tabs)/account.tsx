import { fetchUserBookings } from '@/services/supabaseService';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, DimensionValue, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
                            colors={['#2A2A2E', '#141414', '#080808']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.9, y: 0.8 }}
                            style={styles.membershipCard}
                        >
                            {/* World Map Texture (Simulated with random dots or simple circles) */}
                            <View style={styles.worldMapOverlay}>
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.mapDot,
                                            {
                                                top: (Math.random() * 100 + '%') as DimensionValue,
                                                left: (Math.random() * 100 + '%') as DimensionValue,
                                                opacity: Math.random() * 0.3
                                            }
                                        ]}
                                    />
                                ))}
                            </View>

                            <View style={styles.cardShine} />

                            {/* Card Content */}
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    {/* Metallic Chip */}
                                    <LinearGradient
                                        colors={['#FCD34D', '#D97706', '#F59E0B']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.chipIcon}
                                    >
                                        <View style={styles.chipLine} />
                                        <View style={[styles.chipLine, { left: 10 }]} />
                                        <View style={[styles.chipLine, { left: 20 }]} />
                                        <View style={[styles.chipLine, { top: '50%', height: 1, width: '100%', left: 0 }]} />
                                    </LinearGradient>

                                    {/* Contactless Symbol */}
                                    <View style={{ position: 'absolute', left: 60, top: 4 }}>
                                        <Ionicons name="wifi" size={24} color="rgba(255,255,255,0.3)" style={{ transform: [{ rotate: '90deg' }] }} />
                                    </View>

                                    <View style={styles.memberBadge}>
                                        <Text style={styles.memberBadgeText}>BLACK TIER</Text>
                                    </View>
                                </View>

                                <View style={styles.middleSection}>
                                    <View style={styles.avatarBorder}>
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
                                                    <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>
                                                        {displayName.charAt(0)}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    <View style={{ marginLeft: 16 }}>
                                        <Text style={styles.userName}>{displayName}</Text>
                                        <Text style={styles.cardNumber}>•••• •••• •••• 4290</Text>
                                        <Text style={styles.userSince}>VALID THRU 12/28</Text>
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.pointsRow}>
                                            <Text style={styles.pointsLabel}>RENTLY POINTS</Text>
                                            <Text style={styles.pointsValue}>12,450</Text>
                                        </View>
                                        <View style={styles.progressBarBg}>
                                            <LinearGradient
                                                colors={['#FFF', '#9CA3AF']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                style={[styles.progressBarFill, { width: '75%' }]}
                                            />
                                        </View>
                                        <View style={styles.statusRow}>
                                            <Text style={styles.progressText}>Diamond Status</Text>
                                            <Text style={styles.progressText}>75%</Text>
                                        </View>
                                    </View>
                                    {/* Holographic Seal */}
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
                                        style={styles.hologramSeal}
                                    >
                                        <Ionicons name="ribbon" size={24} color="rgba(255,255,255,0.6)" />
                                    </LinearGradient>
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
        height: 240, // Increased height for better spacing
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#333',
    },
    worldMapOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.5,
    },
    mapDot: {
        position: 'absolute',
        width: 2,
        height: 2,
        borderRadius: 1,
        backgroundColor: '#FFF',
    },
    cardShine: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        backgroundColor: 'rgba(255,255,255,0.03)',
        transform: [{ rotate: '45deg' }],
    },
    cardContent: {
        flex: 1,
        padding: 22, // Increased padding
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'relative',
    },
    chipIcon: {
        width: 38, // Slightly larger
        height: 28,
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    chipLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    memberBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
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
        marginTop: 16, // Added spacing from top
    },
    avatarBorder: {
        width: 52, // Slightly larger
        height: 52,
        borderRadius: 26,
        padding: 2,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    avatarContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 26,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    userName: {
        fontSize: 17, // Balanced
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
        marginBottom: 2,
    },
    cardNumber: {
        color: '#9CA3AF',
        fontSize: 12,
        letterSpacing: 2,
        fontFamily: 'Inter_500Medium',
        marginVertical: 3,
    },
    userSince: {
        fontSize: 10,
        color: '#9CA3AF',
        fontFamily: 'Inter_500Medium',
    },
    cardFooter: {
        marginTop: 16, // Added spacing from middle section
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pointsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    pointsLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: 1,
    },
    pointsValue: {
        fontSize: 14,
        fontFamily: 'Inter_800ExtraBold',
        color: '#FFF',
    },

    progressBarBg: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        width: '100%',
        marginBottom: 8, // Increased spacing
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 2,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 10,
        color: '#9CA3AF',
        fontFamily: 'Inter_500Medium',
    },
    hologramSeal: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 14,
    },
    cardPatternCircle: { display: 'none' },
    cardPatternLine: { display: 'none' },
    statsGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        paddingVertical: 24, // Increased breathing space
        marginBottom: 36,
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
