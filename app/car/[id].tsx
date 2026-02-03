import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getCarData } from '@/services/carDataStore';

const { width, height } = Dimensions.get('window');

export default function CarDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Get car data from store
    const storedCar = getCarData(id as string);

    // Use stored data or fallback to mock data
    const car = storedCar ? {
        name: storedCar.model,
        brand: storedCar.brand,
        rating: storedCar.rating?.toFixed(1) || '4.5',
        reviews: '(23)',
        price: `₹${storedCar.price}k`,
        description: `Experience the ${storedCar.model}. This premium vehicle offers a perfect blend of performance, comfort, and advanced technology. Perfect for business trips or weekend getaways.`,
        features: [
            { icon: 'speedometer-outline', label: '250 km/h' },
            { icon: 'hardware-chip-outline', label: storedCar.transmission || 'Auto' },
            { icon: 'people-outline', label: `${storedCar.seats || 5} Seats` },
            { icon: 'leaf-outline', label: storedCar.fuelType || 'Petrol' },
        ],
        image: storedCar.image,
    } : null;

    if (!car) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Inter_700Bold' }}>Car details not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, padding: 12, backgroundColor: '#1C1C1E', borderRadius: 12 }}>
                    <Text style={{ color: '#FFF', fontFamily: 'Inter_600SemiBold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            {/* Hero Image Section */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: car.image }} style={styles.heroImage} contentFit="cover" />
                <View style={styles.imageOverlay} />

                {/* Header Actions */}
                <SafeAreaView style={styles.headerAbsolute} edges={['top']}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="share-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="heart-outline" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            {/* Content Scroll */}
            <View style={styles.contentContainer}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Title & Rating */}
                    <View style={styles.titleSection}>
                        <View>
                            <Text style={styles.carBrand}>{car.brand || 'Premium'}</Text>
                            <Text style={styles.carName}>{car.name}</Text>
                        </View>
                        <View style={styles.ratingBox}>
                            <Ionicons name="star" size={16} color="#000" />
                            <Text style={styles.ratingText}>{car.rating}</Text>
                        </View>
                    </View>

                    {/* Features Info Grid */}
                    <View style={styles.featuresGrid}>
                        {car.features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <View style={styles.featureIconBox}>
                                    <Ionicons name={feature.icon as any} size={24} color="#FFF" />
                                </View>
                                <Text style={styles.featureLabel}>{feature.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>
                            {car.description} <Text style={styles.readMore}>Read More</Text>
                        </Text>
                    </View>

                    {/* Location */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Car Location</Text>
                        <View style={styles.locationCard}>
                            <View style={styles.locationIcon}>
                                <Ionicons name="location" size={24} color="#FFF" />
                            </View>
                            <View style={styles.locationInfo}>
                                <Text style={styles.locationName}>Juhu, Mumbai</Text>
                                <Text style={styles.locationDist}>2.5 km away</Text>
                            </View>
                            <TouchableOpacity style={styles.mapBtn}>
                                <Text style={styles.mapBtnText}>Map</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Spacer for bottom bar */}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>

            {/* Floating Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Daily Price</Text>
                    <Text style={styles.priceValue}>₹{car.price}<Text style={styles.priceUnit}>/day</Text></Text>
                </View>
                <TouchableOpacity style={styles.bookButton} onPress={() => router.push(`/checkout/${id}`)}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                    <Ionicons name="arrow-forward" size={18} color="#000" />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    imageContainer: {
        width: width,
        height: height * 0.45,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerAbsolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)', // Glassy effect
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(10px)', // Works on iOS/Web content usually
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    contentContainer: {
        flex: 1,
        marginTop: -40, // Overlap the image
        backgroundColor: '#000000',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
    },
    scrollContent: {
        padding: 24,
    },
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    carBrand: {
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    carName: {
        fontSize: 30,
        fontFamily: 'Inter_800ExtraBold',
        color: '#FFFFFF',
        lineHeight: 36,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    ratingText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 14,
    },
    featuresGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    featureItem: {
        width: (width - 48 - 36) / 4, // 4 items, padding 20*2=48, gap 12*3=36
        height: 80,
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    featureIconBox: {
        marginBottom: 8,
    },
    featureLabel: {
        color: '#D1D5DB',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 15,
        fontFamily: 'Inter_400Regular',
        color: '#9CA3AF',
        lineHeight: 24,
    },
    readMore: {
        color: '#FFF',
        fontFamily: 'Inter_600SemiBold',
    },
    locationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    locationIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#27272A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    locationInfo: {
        flex: 1,
    },
    locationName: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        color: '#FFF',
        marginBottom: 2,
    },
    locationDist: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    mapBtn: {
        backgroundColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    mapBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#1C1C1E',
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        marginBottom: 4,
        fontFamily: 'Inter_500Medium',
    },
    priceValue: {
        color: '#FFF',
        fontSize: 24,
        fontFamily: 'Inter_700Bold',
    },
    priceUnit: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '400',
    },
    bookButton: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        gap: 8,
    },
    bookButtonText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
});
