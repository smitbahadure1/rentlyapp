import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

// Mock Data
const BOOKINGS = [
    {
        id: '1',
        status: 'active',
        carName: 'BMW X4 M',
        image: require('@/assets/images/rec_bmw_x4.png'),
        dates: 'Oct 12 - Oct 15',
        time: '10:00 AM',
        location: 'Lagos Airport, Terminal 2',
        price: 'N250k',
        ref: 'RNT-8293X'
    },
    {
        id: '2',
        status: 'upcoming',
        carName: 'Mercedes Benz GLC',
        image: require('@/assets/images/rec_bmw_5.png'),
        dates: 'Nov 05 - Nov 08',
        time: '09:00 AM',
        location: 'Victoria Island, Lagos',
        price: 'N400k',
        ref: 'RNT-9921Y'
    },
    {
        id: '3',
        status: 'completed',
        carName: 'Toyota Camry SE',
        image: require('@/assets/images/rec_bmw_x4.png'),
        dates: 'Sep 20 - Sep 22',
        time: '12:30 PM',
        location: 'Ikeja, Lagos',
        price: 'N120k',
        ref: 'RNT-1123Z'
    },
    {
        id: '4',
        status: 'cancelled',
        carName: 'Honda Accord',
        image: require('@/assets/images/rec_bmw_5.png'),
        dates: 'Aug 10 - Aug 11',
        time: '--:--',
        location: 'Surulere, Lagos',
        price: 'N80k',
        ref: 'RNT-0012A'
    }
];

const TABS = ['Active', 'Upcoming', 'History'];

export default function BookingsScreen() {
    const [activeTab, setActiveTab] = useState('Active');

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#10B981'; // Emerald Green
            case 'upcoming': return '#3B82F6'; // Blue
            case 'completed': return '#9CA3AF'; // Grey
            case 'cancelled': return '#EF4444'; // Red
            default: return '#FFF';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'On Trip';
            case 'upcoming': return 'Confirmed';
            case 'completed': return 'Completed';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    const filteredBookings = BOOKINGS.filter(item => {
        if (activeTab === 'Active') return item.status === 'active';
        if (activeTab === 'Upcoming') return item.status === 'upcoming';
        if (activeTab === 'History') return item.status === 'completed' || item.status === 'cancelled';
        return true;
    });

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <Text style={styles.headerTitle}>My Bookings</Text>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filteredBookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="car-sport-outline" size={64} color="#333" />
                        <Text style={styles.emptyTitle}>No bookings found</Text>
                        <Text style={styles.emptySubtitle}>It seems you don't have any bookings in this category.</Text>
                    </View>
                ) : (
                    filteredBookings.map((item) => (
                        <View key={item.id} style={styles.ticketCard}>
                            {/* Card Header: Ref & Status */}
                            <View style={styles.cardHeader}>
                                <Text style={styles.refText}>{item.ref}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                                        {getStatusText(item.status)}
                                    </Text>
                                </View>
                            </View>

                            {/* Main Info */}
                            <View style={styles.mainInfo}>
                                <Image source={item.image} style={styles.carImage} contentFit="contain" />
                                <View style={styles.infoCol}>
                                    <Text style={styles.carName}>{item.carName}</Text>
                                    <Text style={styles.priceText}>{item.price}</Text>
                                </View>
                            </View>

                            {/* Details Row */}
                            <View style={styles.detailsRow}>
                                <View style={styles.detailItem}>
                                    <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                                    <Text style={styles.detailText}>{item.dates}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                                    <Text style={styles.detailText}>{item.time}</Text>
                                </View>
                            </View>

                            <View style={[styles.detailsRow, { marginTop: 8 }]}>
                                <View style={styles.detailItem}>
                                    <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                                    <Text style={styles.detailText} numberOfLines={1} style={{ maxWidth: 200, color: '#9CA3AF', fontSize: 13, marginLeft: 6 }}>{item.location}</Text>
                                </View>
                            </View>

                            {/* Actions Divider */}
                            <View style={styles.divider} />

                            {/* Actions */}
                            <View style={styles.actionRow}>
                                {item.status === 'active' || item.status === 'upcoming' ? (
                                    <>
                                        <TouchableOpacity style={styles.actionBtn}>
                                            <Text style={styles.actionBtnText}>Modify</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
                                            <Text style={styles.primaryBtnText}>View Ticket</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity style={styles.actionBtnFull}>
                                        <Text style={styles.actionBtnText}>Download Receipt</Text>
                                    </TouchableOpacity>
                                )}
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
        backgroundColor: '#000000',
    },
    safeArea: {
        backgroundColor: '#000000',
        paddingHorizontal: 20,
        paddingBottom: 10,
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
        backgroundColor: '#333333',
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
        opacity: 0.7,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 8,
        textAlign: 'center',
        width: '80%',
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
        marginBottom: 16,
    },
    refText: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontFamily: 'Inter_700Bold',
        textTransform: 'uppercase',
    },
    mainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    carImage: {
        width: 80,
        height: 50,
        marginRight: 16,
    },
    infoCol: {
        flex: 1,
    },
    carName: {
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
        marginBottom: 4,
    },
    priceText: {
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        color: '#9CA3AF',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        color: '#D1D5DB',
        fontSize: 13,
        marginLeft: 6,
        fontFamily: 'Inter_500Medium',
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 16,
        borderStyle: 'dashed', // Note: borderStyle doesn't work well on View borders in RN without borderWidth.
        borderWidth: 1,        // Using solid for now or dashed plugin. Kept simple solid.
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#27272A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    actionBtnFull: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#27272A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    actionBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    primaryBtn: {
        backgroundColor: '#FFF',
        borderColor: '#FFF',
    },
    primaryBtnText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '700',
    },
});
