import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions, Platform, Modal, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, DateData } from 'react-native-calendars';
import { getCarData } from '@/services/carDataStore';

const { width } = Dimensions.get('window');

export default function CheckoutScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [insurance, setInsurance] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('card');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Date Selection State
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)); // Default 3 days later
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');

    // Get car data from store
    const storedCar = getCarData(id as string);

    // Use stored data or fallback to mock data
    const car = storedCar ? {
        name: storedCar.model,
        brand: storedCar.brand,
        image: storedCar.image,
        price: (storedCar.price || 250) * 1000, // Convert from ₹Xk to actual number
        rating: storedCar.rating?.toFixed(1) || '4.5',
    } : {
        name: 'BMW 5 Series',
        brand: 'BMW',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        price: 250000,
        rating: '5.0',
    };

    // Calculate Duration & Totals
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const basePrice = car.price * days;
    const insurancePrice = insurance ? 45000 : 0;
    const total = basePrice + insurancePrice;

    const formatCurrency = (amount: number) => '₹ ' + amount.toLocaleString('en-IN');
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const openPicker = (mode: 'start' | 'end') => {
        setPickerMode(mode);
        setShowPicker(true);
    };

    const onDayPress = (day: DateData) => {
        // Correct date construction from DayObject (year, month, day)
        // month is 1-indexed in DateData
        const selectedDate = new Date(day.year, day.month - 1, day.day);

        if (pickerMode === 'start') {
            setStartDate(selectedDate);
            if (selectedDate > endDate) {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(selectedDate.getDate() + 3);
                setEndDate(nextDay);
            }
        } else {
            if (selectedDate > startDate) {
                setEndDate(selectedDate);
            } else {
                const nextDay = new Date(startDate);
                nextDay.setDate(startDate.getDate() + 1);
                setEndDate(nextDay);
            }
        }
        setShowPicker(false);
    };

    const handlePayment = async () => {
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccessModal(true);

            // Auto redirect to bookings after 2.5 seconds
            setTimeout(() => {
                setShowSuccessModal(false);
                router.push('/(tabs)/bookings');
            }, 2500);
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Custom Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Review & Pay</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                    {/* Visual Receipt Card */}
                    <View style={styles.receiptCard}>
                        {/* Car Header */}
                        <View style={styles.carHeader}>
                            <Image source={{ uri: car.image }} style={styles.carImage} contentFit="cover" />
                            <View style={styles.carOverlay} />
                            <View style={styles.carMeta}>
                                <Text style={styles.carBrand}>{car.brand || 'Premium Class'}</Text>
                                <Text style={styles.carName}>{car.name}</Text>
                                <View style={styles.ratingBadge}>
                                    <Ionicons name="star" size={10} color="#000" />
                                    <Text style={styles.ratingText}>{car.rating}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Trip Timeline */}
                        <View style={styles.tripSection}>
                            <View style={styles.tripRow}>
                                <TouchableOpacity onPress={() => openPicker('start')}>
                                    <Text style={styles.tripLabel}>Pick-up</Text>
                                    <Text style={styles.tripDate}>{formatDate(startDate)}</Text>
                                    <Text style={styles.tripTime}>{formatTime(startDate)}</Text>
                                </TouchableOpacity>

                                <View style={styles.tripConnector}>
                                    <View style={styles.dot} />
                                    <View style={styles.line} />
                                    <View style={styles.durationChip}>
                                        <Text style={styles.durationText}>{days}d</Text>
                                    </View>
                                    <View style={styles.line} />
                                    <View style={[styles.dot, { backgroundColor: '#FFF' }]} />
                                </View>

                                <TouchableOpacity onPress={() => openPicker('end')} style={{ alignItems: 'flex-end' }}>
                                    <Text style={styles.tripLabel}>Return</Text>
                                    <Text style={styles.tripDate}>{formatDate(endDate)}</Text>
                                    <Text style={styles.tripTime}>{formatTime(endDate)}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.locationText}>Lagos Airport, Terminal 2</Text>
                        </View>

                        {/* Dashed Divider */}
                        <View style={styles.receiptDivider}>
                            <View style={styles.notchLeft} />
                            <View style={styles.dashedLine} />
                            <View style={styles.notchRight} />
                        </View>

                        {/* Price Breakdown */}
                        <View style={styles.priceSection}>
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>Rental Rate ({days} days)</Text>
                                <Text style={styles.rowValue}>{formatCurrency(basePrice)}</Text>
                            </View>

                            {/* Insurance Toggle Row */}
                            <View style={styles.insuranceRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.insuranceTitle}>Full Protection</Text>
                                    <Text style={styles.insuranceDesc}>Covers accidents & theft</Text>
                                </View>
                                <View style={styles.insuranceRight}>
                                    <Text style={styles.insurancePrice}>+ {formatCurrency(45000)}</Text>
                                    <Switch
                                        value={insurance}
                                        onValueChange={setInsurance}
                                        trackColor={{ false: '#333', true: '#10B981' }}
                                        thumbColor={'#FFF'}
                                    />
                                </View>
                            </View>

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total to pay</Text>
                                <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Payment Method Selector */}
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <View style={styles.paymentGrid}>
                        {/* UPI */}
                        <TouchableOpacity
                            style={[styles.paymentCard, selectedPayment === 'upi' && styles.activePayment]}
                            onPress={() => setSelectedPayment('upi')}
                        >
                            <Ionicons name="flash" size={24} color="#FFF" />
                            <View style={styles.paymentInfo}>
                                <Text style={styles.payLabel}>UPI</Text>
                                <Text style={styles.payNumber}>Pay via UPI</Text>
                            </View>
                            {selectedPayment === 'upi' && (
                                <View style={styles.checkCircle}>
                                    <Ionicons name="checkmark" size={14} color="#000" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Google Pay */}
                        <TouchableOpacity
                            style={[styles.paymentCard, selectedPayment === 'gpay' && styles.activePayment]}
                            onPress={() => setSelectedPayment('gpay')}
                        >
                            <Ionicons name="logo-google" size={24} color="#FFF" />
                            <View style={styles.paymentInfo}>
                                <Text style={styles.payLabel}>Google Pay</Text>
                                <Text style={styles.payNumber}>Quick pay</Text>
                            </View>
                            {selectedPayment === 'gpay' && (
                                <View style={styles.checkCircle}>
                                    <Ionicons name="checkmark" size={14} color="#000" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* PhonePe */}
                        <TouchableOpacity
                            style={[styles.paymentCard, selectedPayment === 'phonepe' && styles.activePayment]}
                            onPress={() => setSelectedPayment('phonepe')}
                        >
                            <Ionicons name="phone-portrait" size={24} color="#FFF" />
                            <View style={styles.paymentInfo}>
                                <Text style={styles.payLabel}>PhonePe</Text>
                                <Text style={styles.payNumber}>Instant</Text>
                            </View>
                            {selectedPayment === 'phonepe' && (
                                <View style={styles.checkCircle}>
                                    <Ionicons name="checkmark" size={14} color="#000" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Paytm */}
                        <TouchableOpacity
                            style={[styles.paymentCard, selectedPayment === 'paytm' && styles.activePayment]}
                            onPress={() => setSelectedPayment('paytm')}
                        >
                            <Ionicons name="wallet" size={24} color="#FFF" />
                            <View style={styles.paymentInfo}>
                                <Text style={styles.payLabel}>Paytm</Text>
                                <Text style={styles.payNumber}>Wallet</Text>
                            </View>
                            {selectedPayment === 'paytm' && (
                                <View style={styles.checkCircle}>
                                    <Ionicons name="checkmark" size={14} color="#000" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Credit/Debit Card */}
                        <TouchableOpacity
                            style={[styles.paymentCard, selectedPayment === 'card' && styles.activePayment]}
                            onPress={() => setSelectedPayment('card')}
                        >
                            <Ionicons name="card" size={24} color="#FFF" />
                            <View style={styles.paymentInfo}>
                                <Text style={styles.payLabel}>Card</Text>
                                <Text style={styles.payNumber}>•••• 4242</Text>
                            </View>
                            {selectedPayment === 'card' && (
                                <View style={styles.checkCircle}>
                                    <Ionicons name="checkmark" size={14} color="#000" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Net Banking */}
                        <TouchableOpacity
                            style={[styles.paymentCard, selectedPayment === 'netbanking' && styles.activePayment]}
                            onPress={() => setSelectedPayment('netbanking')}
                        >
                            <Ionicons name="business" size={24} color="#FFF" />
                            <View style={styles.paymentInfo}>
                                <Text style={styles.payLabel}>Net Banking</Text>
                                <Text style={styles.payNumber}>All banks</Text>
                            </View>
                            {selectedPayment === 'netbanking' && (
                                <View style={styles.checkCircle}>
                                    <Ionicons name="checkmark" size={14} color="#000" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Apple Pay */}
                        <TouchableOpacity
                            style={[styles.paymentCard, selectedPayment === 'apple' && styles.activePayment]}
                            onPress={() => setSelectedPayment('apple')}
                        >
                            <Ionicons name="logo-apple" size={24} color="#FFF" />
                            <View style={styles.paymentInfo}>
                                <Text style={styles.payLabel}>Apple Pay</Text>
                                <Text style={styles.payNumber}>Default</Text>
                            </View>
                            {selectedPayment === 'apple' && (
                                <View style={styles.checkCircle}>
                                    <Ionicons name="checkmark" size={14} color="#000" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Navigation - Bottom padding for scroll */}
                </ScrollView>

                {/* Footer Action */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                        onPress={handlePayment}
                        disabled={isProcessing}
                    >
                        <LinearGradient
                            colors={isProcessing ? ['#9CA3AF', '#6B7280'] : ['#FFFFFF', '#E5E7EB']}
                            style={styles.payGradient}
                        >
                            {isProcessing ? (
                                <>
                                    <ActivityIndicator size="small" color="#000" />
                                    <Text style={styles.payButtonText}>Processing...</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.payButtonText}>Confirm and Pay</Text>
                                    <Ionicons name="lock-closed" size={16} color="#000" />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={styles.secureText}>
                        <Ionicons name="shield-checkmark" size={12} color="#4B5563" /> Secure Payment
                    </Text>
                </View>

                {/* Custom Calendar Modal */}
                <Modal visible={showPicker} transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    Select {pickerMode === 'start' ? 'Pick-up' : 'Return'} Date
                                </Text>
                                <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.modalClose}>
                                    <Ionicons name="close" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                            <Calendar
                                key={pickerMode}
                                current={(pickerMode === 'start' ? startDate : endDate).toISOString().split('T')[0]}
                                onDayPress={onDayPress}
                                markedDates={{
                                    [startDate.toISOString().split('T')[0]]: { selected: true, selectedColor: '#FFF', selectedTextColor: '#000' },
                                    [endDate.toISOString().split('T')[0]]: { selected: true, selectedColor: '#FFF', selectedTextColor: '#000' },
                                }}
                                theme={{
                                    backgroundColor: '#1C1C1E',
                                    calendarBackground: '#1C1C1E',
                                    textSectionTitleColor: '#9CA3AF',
                                    selectedDayBackgroundColor: '#FFFFFF',
                                    selectedDayTextColor: '#000000',
                                    todayTextColor: '#F59E0B',
                                    dayTextColor: '#FFFFFF',
                                    textDisabledColor: '#333333',
                                    dotColor: '#F59E0B',
                                    selectedDotColor: '#000000',
                                    arrowColor: '#FFFFFF',
                                    disabledArrowColor: '#333333',
                                    monthTextColor: '#FFFFFF',
                                    indicatorColor: '#FFFFFF',
                                    textDayFontFamily: 'Inter_500Medium',
                                    textMonthFontFamily: 'Inter_700Bold',
                                    textDayHeaderFontFamily: 'Inter_500Medium',
                                    textDayFontSize: 16,
                                    textMonthFontSize: 18,
                                    textDayHeaderFontSize: 12
                                }}
                            />
                        </View>
                    </View>
                </Modal>

                {/* Payment Success Modal */}
                <Modal visible={showSuccessModal} transparent animationType="fade">
                    <View style={styles.successOverlay}>
                        <View style={styles.successContainer}>
                            {/* Success Icon */}
                            <View style={styles.successIconContainer}>
                                <View style={styles.successIconCircle}>
                                    <Ionicons name="checkmark" size={70} color="#000" />
                                </View>
                            </View>

                            {/* Success Message */}
                            <Text style={styles.successTitle}>Payment Successful!</Text>
                            <Text style={styles.successMessage}>
                                Your booking has been confirmed.{'\n'}
                                Redirecting to your bookings...
                            </Text>

                            {/* Loading Indicator */}
                            <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 20 }} />
                        </View>
                    </View>
                </Modal>
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
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: '#FFF',
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    receiptCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 32,
    },
    carHeader: {
        height: 180,
        position: 'relative',
    },
    carImage: {
        width: '100%',
        height: '100%',
    },
    carOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    carMeta: {
        position: 'absolute',
        bottom: 16,
        left: 20,
    },
    carBrand: {
        color: '#D1D5DB',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    carName: {
        color: '#FFF',
        fontSize: 24,
        fontFamily: 'Inter_800ExtraBold',
        marginBottom: 6,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        gap: 4,
    },
    ratingText: {
        color: '#000',
        fontSize: 10,
        fontFamily: 'Inter_700Bold',
    },
    tripSection: {
        padding: 24,
        paddingBottom: 20,
    },
    tripRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    tripLabel: {
        color: '#6B7280',
        fontSize: 12,
        marginBottom: 4,
    },
    tripDate: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    tripTime: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    tripConnector: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4B5563',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    durationChip: {
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    durationText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: 'Inter_600SemiBold',
    },
    locationText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        marginTop: 4,
    },
    receiptDivider: {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#1C1C1E',
        overflow: 'hidden',
    },
    notchLeft: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#000',
        position: 'absolute',
        left: -10,
    },
    notchRight: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#000',
        position: 'absolute',
        right: -10,
    },
    dashedLine: {
        flex: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#333',
        marginHorizontal: 16,
        height: 1,
    },
    priceSection: {
        padding: 24,
        paddingTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    rowLabel: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    rowValue: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
    insuranceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#27272A',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    insuranceTitle: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 2,
    },
    insuranceDesc: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    insuranceRight: {
        alignItems: 'flex-end',
        gap: 8,
    },
    insurancePrice: {
        color: '#10B981',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    totalLabel: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    totalValue: {
        color: '#FFF',
        fontSize: 24,
        fontFamily: 'Inter_800ExtraBold',
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
        marginBottom: 16,
    },
    paymentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    paymentCard: {
        width: (width - 40 - 12) / 2, // 2 columns with gap
        height: 90,
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#333',
    },
    paymentInfo: {
        flex: 1,
    },
    activePayment: {
        borderColor: '#FFF',
        backgroundColor: '#27272A',
    },
    payLabel: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
    payNumber: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    checkCircle: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 10 : 20,
    },
    payButton: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        marginBottom: 16,
    },
    payGradient: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    payButtonText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    secureText: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#27272A',
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    modalClose: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    payButtonDisabled: {
        opacity: 0.7,
    },
    successOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    successContainer: {
        backgroundColor: '#000000',
        borderRadius: 32,
        padding: 48,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        width: '90%',
        maxWidth: 400,
    },
    successIconContainer: {
        marginBottom: 32,
    },
    successIconCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 32,
        fontFamily: 'Inter_800ExtraBold',
        color: '#FFF',
        marginBottom: 16,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 24,
    },
});
