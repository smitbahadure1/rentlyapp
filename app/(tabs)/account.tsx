import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient'; // We might need to handle this if not available, but usually distinct styling works. For now, flat gradients or images.
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

// Mock Data
const MENU_ITEMS = [
    { icon: 'person-outline', label: 'Personal Information' },
    { icon: 'shield-checkmark-outline', label: 'Login & Security' },
    { icon: 'card-outline', label: 'Payments & Payouts' },
    { icon: 'settings-outline', label: 'Settings' },
];

export default function AccountScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="notifications-outline" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Premium Membership Card */}
                    <View style={styles.membershipCard}>
                        <View style={styles.cardPattern} />
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <View style={styles.avatarBorder}>
                                    <View style={styles.avatar}>
                                        <Ionicons name="person" size={32} color="#000" />
                                    </View>
                                </View>
                                <View style={styles.memberBadge}>
                                    <Ionicons name="diamond" size={12} color="#000" />
                                    <Text style={styles.memberBadgeText}>BLACK TIER</Text>
                                </View>
                            </View>

                            <View style={styles.userDetails}>
                                <Text style={styles.userName}>Alex Johnson</Text>
                                <Text style={styles.userSince}>Member since 2024</Text>
                            </View>

                            <View style={styles.pointsRow}>
                                <View>
                                    <Text style={styles.pointsLabel}>Rently Points</Text>
                                    <Text style={styles.pointsValue}>12,450</Text>
                                </View>
                                <TouchableOpacity style={styles.tierBtn}>
                                    <Text style={styles.tierBtnText}>View Benefits</Text>
                                    <Ionicons name="arrow-forward" size={12} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Dashboard Grid */}
                    <View style={styles.statsGrid}>
                        <TouchableOpacity style={styles.statBox}>
                            <Text style={styles.statNumber}>12</Text>
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

                    {/* Quick Actions Grid */}
                    <Text style={styles.sectionTitle}>Dashboard</Text>
                    <View style={styles.dashboardGrid}>
                        <TouchableOpacity style={styles.dashboardItem}>
                            <View style={styles.dashIconBox}>
                                <Ionicons name="heart" size={24} color="#FFF" />
                            </View>
                            <Text style={styles.dashLabel}>Favorites</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dashboardItem}>
                            <View style={styles.dashIconBox}>
                                <Ionicons name="wallet" size={24} color="#FFF" />
                            </View>
                            <Text style={styles.dashLabel}>Wallet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dashboardItem}>
                            <View style={styles.dashIconBox}>
                                <Ionicons name="document-text" size={24} color="#FFF" />
                            </View>
                            <Text style={styles.dashLabel}>Docs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dashboardItem}>
                            <View style={styles.dashIconBox}>
                                <Ionicons name="chatbubble" size={24} color="#FFF" />
                            </View>
                            <Text style={styles.dashLabel}>Support</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Menu List */}
                    <View style={styles.menuSection}>
                        {MENU_ITEMS.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.menuRow}>
                                <View style={styles.menuLeft}>
                                    <Ionicons name={item.icon} size={22} color="#D1D5DB" />
                                    <Text style={styles.menuText}>{item.label}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#4B5563" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.logoutButton}>
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
    membershipCard: {
        marginHorizontal: 20,
        height: 220,
        backgroundColor: '#1C1C1E',
        borderRadius: 30,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 32,
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
        alignItems: 'flex-start',
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
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    memberBadge: {
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    memberBadgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    userDetails: {
        marginVertical: 10,
    },
    userName: {
        fontSize: 26,
        fontFamily: 'Inter_800ExtraBold',
        color: '#FFF',
        letterSpacing: -0.5,
    },
    userSince: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 4,
    },
    pointsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    pointsLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Inter_600SemiBold',
        textTransform: 'uppercase',
    },
    pointsValue: {
        fontSize: 24,
        fontFamily: 'Inter_800ExtraBold',
        color: '#FFF',
        marginTop: 2,
    },
    tierBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    tierBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
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
    dashboardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    dashboardItem: {
        width: '23%',
        alignItems: 'center',
        gap: 12,
    },
    dashIconBox: {
        width: 60,
        height: 60,
        borderRadius: 24,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    dashLabel: {
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        color: '#D1D5DB',
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
