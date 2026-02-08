
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CarCardProps {
    car: any;
    onPress: () => void;
}

export default function CarCard({ car, onPress }: CarCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <TouchableOpacity
            style={styles.feedCard}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.feedImageContainer}>
                {car.image && !imageError ? (
                    <Image
                        source={{ uri: car.image }}
                        style={styles.feedImage}
                        contentFit="cover"
                        onError={() => setImageError(true)}
                        transition={200}
                    />
                ) : (
                    <View style={[styles.feedImage, styles.placeholderContainer]}>
                        <Ionicons name="car-sport-outline" size={48} color="#6B7280" />
                        <Text style={styles.placeholderText}>No Image Available</Text>
                    </View>
                )}

                <View style={styles.feedBadge}>
                    <Ionicons name="flash" size={12} color="#FFF" />
                    <Text style={styles.feedBadgeText}>Popular</Text>
                </View>
                <TouchableOpacity style={styles.likeButton}>
                    <Ionicons name="heart-outline" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.feedInfo}>
                <View style={styles.feedHeader}>
                    <Text style={styles.feedTitle}>{car.brand} {car.model}</Text>
                    <View style={styles.ratingTag}>
                        <Ionicons name="star" size={12} color="#000" />
                        <Text style={styles.ratingNum}>{car.rating?.toFixed(1) || '4.5'}</Text>
                    </View>
                </View>

                <Text style={styles.feedSubtitle}>{car.transmission} • {car.seats} Seats • {car.fuelType || car.fuel_type}</Text>

                <View style={styles.feedFooter}>
                    <View>
                        <Text style={styles.feedPrice}>₹{car.price}k<Text style={styles.feedPriceUnit}>/day</Text></Text>
                        <Text style={styles.feedTotal}>Free cancellation</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.bookBtn}
                        onPress={onPress}
                    >
                        <Text style={styles.bookBtnText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    feedCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        marginBottom: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    feedImageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: '#27272A',
        position: 'relative',
    },
    feedImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
    },
    placeholderText: {
        color: '#6B7280',
        fontFamily: 'Inter_500Medium',
        marginTop: 8,
        fontSize: 14,
    },
    feedBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    feedBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        marginLeft: 4,
    },
    likeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    feedInfo: {
        padding: 16,
    },
    feedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    feedTitle: {
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
        flex: 1,
        marginRight: 10,
    },
    ratingTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    ratingNum: {
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        color: '#000',
    },
    feedSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 16,
    },
    feedFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 16,
    },
    feedPrice: {
        fontSize: 20,
        fontFamily: 'Inter_700Bold',
        color: '#FFF',
    },
    feedPriceUnit: {
        fontSize: 14,
        fontWeight: '400',
        color: '#9CA3AF',
    },
    feedTotal: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    bookBtn: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    bookBtnText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 14,
    },
});
