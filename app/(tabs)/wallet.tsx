import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Mock Data
const TRANSACTIONS = [
    { id: '1', title: 'Top Up', date: 'Today, 10:30 AM', amount: '+ N50,000', type: 'credit' },
    { id: '2', title: 'Car Rental - BMW 5 Series', date: 'Yesterday, 04:15 PM', amount: '- N25,000', type: 'debit' },
    { id: '3', title: 'Car Rental - Toyota Camry', date: 'Oct 24, 09:00 AM', amount: '- N15,000', type: 'debit' },
    { id: '4', title: 'Refund', date: 'Oct 20, 02:30 PM', amount: '+ N10,000', type: 'credit' },
    { id: '5', title: 'Top Up', date: 'Oct 15, 11:00 AM', amount: '+ N100,000', type: 'credit' },
];

const CARDS = [
    { id: '1', last4: '4242', brand: 'mastercard' },
    { id: '2', last4: '8899', brand: 'visa' },
];

export default function WalletScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <SafeAreaView style={styles.header} edges={['top']}>
                <Text style={styles.headerTitle}>My Wallet</Text>
                <TouchableOpacity style={styles.historyBtn}>
                    <Ionicons name="time-outline" size={24} color="#FFF" />
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <View>
                        <Text style={styles.balanceLabel}>Total Balance</Text>
                        <Text style={styles.balanceAmount}>N 145,000<Text style={styles.balanceDecimal}>.00</Text></Text>
                    </View>
                    <TouchableOpacity style={styles.topUpBtn}>
                        <Ionicons name="add" size={20} color="#000" />
                        <Text style={styles.topUpText}>Top Up</Text>
                    </TouchableOpacity>
                    {/* Decorative Patterns */}
                    <View style={styles.circle1} />
                    <View style={styles.circle2} />
                </View>

                {/* Quick Actions */}
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={styles.actionIconBox}>
                            <Ionicons name="card-outline" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionText}>Cards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={styles.actionIconBox}>
                            <Ionicons name="document-text-outline" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionText}>History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={styles.actionIconBox}>
                            <Ionicons name="gift-outline" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionText}>Vouchers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem}>
                        <View style={styles.actionIconBox}>
                            <Ionicons name="help-circle-outline" size={24} color="#FFF" />
                        </View>
                        <Text style={styles.actionText}>Help</Text>
                    </TouchableOpacity>
                </View>

                {/* Payment Methods */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Methods</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
                        {/* Add New Card */}
                        <TouchableOpacity style={styles.addCardBtn}>
                            <Ionicons name="add" size={32} color="#FFF" />
                            <Text style={styles.addCardText}>Add Card</Text>
                        </TouchableOpacity>

                        {/* Existing Cards */}
                        {CARDS.map((card) => (
                            <View key={card.id} style={styles.paymentCard}>
                                <View style={styles.cardHeader}>
                                    <Ionicons name={card.brand === 'visa' ? 'logo-visa' : 'card'} size={24} color="#FFF" />
                                    <TouchableOpacity>
                                        <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
                                    <Text style={styles.cardExpiry}>12/26</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Recent Transactions */}
                <View style={[styles.section, { paddingBottom: 100 }]}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    {TRANSACTIONS.map((item) => (
                        <View key={item.id} style={styles.transactionItem}>
                            <View style={styles.transactionIconBox}>
                                <Ionicons
                                    name={item.type === 'credit' ? "arrow-down" : "arrow-up"}
                                    size={20}
                                    color={item.type === 'credit' ? "#10B981" : "#FFF"}
                                />
                            </View>
                            <View style={styles.transactionInfo}>
                                <Text style={styles.transactionTitle}>{item.title}</Text>
                                <Text style={styles.transactionDate}>{item.date}</Text>
                            </View>
                            <Text style={[styles.transactionAmount, { color: item.type === 'credit' ? '#10B981' : '#FFF' }]}>
                                {item.amount}
                            </Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
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
        paddingBottom: 20,
        backgroundColor: '#000000',
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Inter_800ExtraBold',
        color: '#FFF',
    },
    historyBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    scrollContent: {
        paddingTop: 10,
    },
    balanceCard: {
        marginHorizontal: 20,
        backgroundColor: '#1C1C1E', // Base dark
        borderRadius: 24,
        padding: 24,
        height: 160,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    balanceLabel: {
        color: '#9CA3AF',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 8,
    },
    balanceAmount: {
        color: '#FFF',
        fontSize: 32,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: -1,
    },
    balanceDecimal: {
        fontSize: 20,
        color: '#9CA3AF',
    },
    topUpBtn: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    topUpText: {
        fontFamily: 'Inter_700Bold',
        color: '#000',
        marginLeft: 4,
    },
    circle1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    circle2: {
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    actionItem: {
        alignItems: 'center',
        gap: 8,
    },
    actionIconBox: {
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    actionText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
        marginLeft: 24,
        marginBottom: 16,
    },
    cardsScroll: {
        paddingHorizontal: 24,
        gap: 16,
    },
    addCardBtn: {
        width: 80,
        height: 140,
        borderRadius: 16,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    addCardText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        marginTop: 8,
    },
    paymentCard: {
        width: 220,
        height: 140,
        backgroundColor: '#27272A', // Slightly lighter
        borderRadius: 16,
        padding: 20,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#333',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardFooter: {
        gap: 4,
    },
    cardNumber: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    cardExpiry: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    transactionIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    transactionDate: {
        color: '#6B7280',
        fontSize: 12,
    },
    transactionAmount: {
        fontSize: 15,
        fontWeight: '700',
    },
});
