import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useState, useEffect, useCallback } from 'react';
import { fetchAllCars, updateCarStatus, deleteCar } from '@/services/adminService';

interface Car {
    id: string;
    brand: string;
    model: string;
    image: string;
    price: number;
    rating: number;
    fuel_type: string;
    transmission: string;
    seats: number;
    status: string;
}

export default function AdminCarsScreen() {
    const router = useRouter();
    const [cars, setCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadCars();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = cars.filter(car =>
                car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.model.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCars(filtered);
        } else {
            setFilteredCars(cars);
        }
    }, [searchQuery, cars]);

    const loadCars = async () => {
        try {
            const allCars = await fetchAllCars();
            setCars(allCars);
            setFilteredCars(allCars);
        } catch (error) {
            console.error('Error loading cars:', error);
            Alert.alert('Error', 'Failed to load cars');
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadCars();
        setRefreshing(false);
    }, []);

    const handleStatusChange = async (carId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'available' ? 'rented' : 'available';

        Alert.alert(
            'Change Status',
            `Change car status to "${newStatus}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            await updateCarStatus(carId, newStatus);
                            await loadCars();
                            Alert.alert('Success', 'Car status updated');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to update car status');
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteCar = async (carId: string, carName: string) => {
        Alert.alert(
            'Delete Car',
            `Are you sure you want to delete "${carName}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteCar(carId);
                            await loadCars();
                            Alert.alert('Success', 'Car deleted successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete car');
                        }
                    }
                }
            ]
        );
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
                        <Text style={styles.headerTitle}>Manage Cars</Text>
                        <Text style={styles.headerSubtitle}>{filteredCars.length} vehicles</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#6B7280" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by brand or model..."
                        placeholderTextColor="#6B7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>

            {/* Cars List */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF00" />
                }
            >
                {filteredCars.map((car) => (
                    <View key={car.id} style={styles.carCard}>
                        <Image
                            source={{ uri: car.image }}
                            style={styles.carImage}
                            contentFit="cover"
                        />

                        <View style={styles.carInfo}>
                            <View style={styles.carHeader}>
                                <View style={styles.carTitleContainer}>
                                    <Text style={styles.carBrand}>{car.brand}</Text>
                                    <Text style={styles.carModel}>{car.model}</Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    car.status === 'available' ? styles.statusAvailable : styles.statusRented
                                ]}>
                                    <Text style={styles.statusText}>{car.status.toUpperCase()}</Text>
                                </View>
                            </View>

                            <View style={styles.carDetails}>
                                <View style={styles.detailItem}>
                                    <Ionicons name="star" size={14} color="#FFD700" />
                                    <Text style={styles.detailText}>{car.rating}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Ionicons name="people" size={14} color="#6B7280" />
                                    <Text style={styles.detailText}>{car.seats} seats</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Ionicons name="speedometer" size={14} color="#6B7280" />
                                    <Text style={styles.detailText}>{car.transmission}</Text>
                                </View>
                            </View>

                            <View style={styles.carFooter}>
                                <Text style={styles.carPrice}>₹{car.price}/day</Text>

                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.actionBtnStatus]}
                                        onPress={() => handleStatusChange(car.id, car.status)}
                                    >
                                        <Ionicons
                                            name={car.status === 'available' ? 'checkmark-circle' : 'close-circle'}
                                            size={18}
                                            color={car.status === 'available' ? '#00FF00' : '#FF4444'}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.actionBtnDelete]}
                                        onPress={() => handleDeleteCar(car.id, `${car.brand} ${car.model}`)}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#FF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                {filteredCars.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="car-sport-outline" size={64} color="#27272A" />
                        <Text style={styles.emptyText}>No cars found</Text>
                        <Text style={styles.emptySubtext}>
                            {searchQuery ? 'Try a different search term' : 'Add cars to get started'}
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
        paddingBottom: 20,
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: '#27272A',
        gap: 12,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 15,
        fontFamily: 'Inter_500Medium',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    carCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#27272A',
    },
    carImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#27272A',
    },
    carInfo: {
        padding: 16,
    },
    carHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    carTitleContainer: {
        flex: 1,
    },
    carBrand: {
        color: '#9CA3AF',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    carModel: {
        color: '#FFF',
        fontSize: 20,
        fontFamily: 'Inter_800ExtraBold',
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusAvailable: {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 0, 0.3)',
    },
    statusRented: {
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 68, 68, 0.3)',
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 1,
    },
    carDetails: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontFamily: 'Inter_500Medium',
    },
    carFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#27272A',
    },
    carPrice: {
        color: '#00FF00',
        fontSize: 20,
        fontFamily: 'Inter_900Black',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    actionBtnStatus: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: '#27272A',
    },
    actionBtnDelete: {
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        borderColor: 'rgba(255, 68, 68, 0.3)',
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
