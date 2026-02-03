import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, interpolateColor } from 'react-native-reanimated';
import { getCarData } from '@/services/carDataStore';

const { width, height } = Dimensions.get('window');

export default function ActiveTripDashboard() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [storedCar, setStoredCar] = useState<any>(null);
    const [isEngineOn, setIsEngineOn] = useState(false);
    const [isLocked, setIsLocked] = useState(true);

    // Animation for Engine Start Button
    const pulse = useSharedValue(1);

    useEffect(() => {
        let car = getCarData(id as string);

        // Fallback for demo purposes if ID doesn't exist in store
        if (!car && id === 'c1') {
            car = {
                id: 'c1',
                brand: 'Porsche',
                model: '911 Carrera',
                image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
                fuel: '84%',
                range: '432 km',
            };
        }

        setStoredCar(car);

        // Continuous pulse animation
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, [id]);

    const animatedPulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: isEngineOn ? 1 : 0.6,
    }));

    if (!storedCar) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Initializing Link...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />


            <View style={styles.overlayContent}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Telematics Bar */}
                    <View style={styles.telematicsGrid}>
                        <View style={styles.teleBox}>
                            <Ionicons name="filter-outline" size={18} color="#9CA3AF" />
                            <Text style={styles.teleVal}>84%</Text>
                            <Text style={styles.teleLabel}>Fuel</Text>
                        </View>
                        <View style={styles.teleBox}>
                            <Ionicons name="thermometer-outline" size={18} color="#9CA3AF" />
                            <Text style={styles.teleVal}>22°C</Text>
                            <Text style={styles.teleLabel}>Cabin</Text>
                        </View>
                        <View style={styles.teleBox}>
                            <Ionicons name="speedometer-outline" size={18} color="#9CA3AF" />
                            <Text style={styles.teleVal}>432</Text>
                            <Text style={styles.teleLabel}>Range</Text>
                        </View>
                    </View>

                    {/* Main Interaction Zone */}
                    <View style={styles.keyZone}>
                        <View style={styles.lockRow}>
                            <TouchableOpacity
                                style={[styles.lockBtn, isLocked && styles.lockBtnActive]}
                                onPress={() => setIsLocked(true)}
                            >
                                <Ionicons name="lock-closed" size={24} color={isLocked ? "#000" : "#9CA3AF"} />
                                <Text style={[styles.lockBtnText, isLocked && { color: '#000' }]}>LOCK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.lockBtn, !isLocked && styles.lockBtnActive]}
                                onPress={() => setIsLocked(false)}
                            >
                                <Ionicons name="lock-open" size={24} color={!isLocked ? "#000" : "#9CA3AF"} />
                                <Text style={[styles.lockBtnText, !isLocked && { color: '#000' }]}>UNLOCK</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Engine Start Button */}
                        <View style={styles.startContainer}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={[styles.startInner, isEngineOn && styles.startInnerOn]}
                                onPress={() => setIsEngineOn(!isEngineOn)}
                            >
                                <View style={[styles.startInnerRing, isEngineOn && styles.startInnerRingOn]} />
                                <Animated.View style={[styles.startPulse, animatedPulseStyle, isEngineOn && { borderColor: '#FFF' }]} />
                                <View style={styles.startContent}>
                                    <Ionicons
                                        name="power"
                                        size={48}
                                        color={isEngineOn ? "#FFF" : "#EF4444"}
                                        style={isEngineOn ? styles.glowIcon : null}
                                    />
                                    <Text style={[styles.startText, isEngineOn && styles.startTextOn]}>
                                        {isEngineOn ? 'ENGINE RUNNING' : 'START ENGINE'}
                                    </Text>
                                    <View style={[styles.ledIndicator, isEngineOn && styles.ledIndicatorOn]} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.actionCircle}>
                                <Ionicons name="bulb-outline" size={22} color="#FFF" />
                                <Text style={styles.actionSmallText}>Lights</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionCircle}>
                                <Ionicons name="volume-high-outline" size={22} color="#FFF" />
                                <Text style={styles.actionSmallText}>Horn</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionCircle}>
                                <Ionicons name="snow-outline" size={22} color="#FFF" />
                                <Text style={styles.actionSmallText}>A/C</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionCircle}>
                                <Ionicons name="open-outline" size={22} color="#FFF" />
                                <Text style={styles.actionSmallText}>Trunk</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Tire Pressure & Health */}
                    <View style={styles.healthSection}>
                        <Text style={styles.sectionTitle}>SYSTEM MONITOR</Text>
                        <View style={styles.healthCard}>
                            <View style={styles.tireGrid}>
                                <View style={styles.tireWrap}>
                                    <Text style={styles.psiVal}>32 <Text style={styles.psiUnit}>PSI</Text></Text>
                                    <View style={styles.tireDot} />
                                </View>
                                <View style={styles.tireWrap}>
                                    <Text style={styles.psiVal}>32 <Text style={styles.psiUnit}>PSI</Text></Text>
                                    <View style={styles.tireDot} />
                                </View>
                            </View>
                            <View style={styles.carOutlineSil}>
                                <Ionicons name="car" size={100} color="#333" />
                            </View>
                            <View style={styles.tireGrid}>
                                <View style={styles.tireWrap}>
                                    <Text style={styles.psiVal}>31 <Text style={styles.psiUnit}>PSI</Text></Text>
                                    <View style={styles.tireDot} />
                                </View>
                                <View style={styles.tireWrap}>
                                    <Text style={styles.psiVal}>33 <Text style={styles.psiUnit}>PSI</Text></Text>
                                    <View style={styles.tireDot} />
                                </View>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </View>

            {/* Top Hub - Absolute on Top, placed at end of JSX to ensure touch priority */}
            <SafeAreaView style={styles.headerAbsolute} edges={['top']} pointerEvents="box-none">
                <View style={styles.header} pointerEvents="box-none">
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.replace('/(tabs)/bookings')}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.carIdentity}>
                        <Text style={styles.brandName}>{storedCar.brand}</Text>
                        <Text style={styles.modelName}>{storedCar.model}</Text>
                    </View>
                    <TouchableOpacity style={styles.sosBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Text style={styles.sosText}>SOS</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFF',
        fontFamily: 'Inter_900Black',
        letterSpacing: 2,
    },
    mapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.45,
        backgroundColor: '#0A0A0A',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    vectorLines: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
    },
    line: {
        position: 'absolute',
        backgroundColor: '#FFF',
        height: 1,
    },
    vehiclePos: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 20,
        height: 20,
        marginLeft: -10,
        marginTop: -10,
        zIndex: 2,
    },
    vehicleDotInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFF',
        position: 'absolute',
        top: 4,
        left: 4,
        zIndex: 3,
    },
    vehicleDotOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    overlayContent: {
        flex: 1,
    },
    headerAbsolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(28, 28, 30, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    carIdentity: {
        alignItems: 'center',
    },
    brandName: {
        color: '#9CA3AF',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 1,
    },
    modelName: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Inter_900Black',
    },
    sosBtn: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    sosText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '900',
    },
    scrollContent: {
        paddingTop: 80,
        paddingBottom: 40,
    },
    telematicsGrid: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: 'rgba(28, 28, 30, 0.9)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 24,
        justifyContent: 'space-around',
    },
    teleBox: {
        alignItems: 'center',
    },
    teleVal: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Inter_800ExtraBold',
        marginTop: 4,
    },
    teleLabel: {
        color: '#6B7280',
        fontSize: 11,
        fontFamily: 'Inter_600SemiBold',
        marginTop: 2,
    },
    keyZone: {
        marginHorizontal: 20,
        backgroundColor: '#111',
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        borderColor: '#222',
        marginBottom: 24,
    },
    lockRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    lockBtn: {
        flex: 1,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    lockBtnActive: {
        backgroundColor: '#FFF',
        borderColor: '#FFF',
    },
    lockBtnText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontFamily: 'Inter_800ExtraBold',
    },
    startContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    startInner: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    startInnerOn: {
        backgroundColor: '#000',
        borderColor: '#FFF',
    },
    startInnerRing: {
        position: 'absolute',
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 2,
        borderColor: '#27272A',
        opacity: 0.5,
    },
    startInnerRingOn: {
        borderColor: 'rgba(255,255,255,0.2)',
    },
    startPulse: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    startContent: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    },
    glowIcon: {
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    startText: {
        color: '#6B7280',
        fontSize: 10,
        fontFamily: 'Inter_900Black',
        marginTop: 12,
        letterSpacing: 1,
    },
    startTextOn: {
        color: '#FFF',
    },
    ledIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#333',
        marginTop: 10,
    },
    ledIndicatorOn: {
        backgroundColor: '#FFF',
        shadowColor: '#FFF',
        shadowRadius: 10,
        elevation: 5,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionCircle: {
        alignItems: 'center',
        gap: 8,
    },
    actionSmallText: {
        color: '#6B7280',
        fontSize: 10,
        fontFamily: 'Inter_600SemiBold',
    },
    healthSection: {
        marginHorizontal: 20,
    },
    sectionTitle: {
        color: '#6B7280',
        fontSize: 11,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 2,
        marginBottom: 16,
        marginLeft: 4,
    },
    healthCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#333',
    },
    tireGrid: {
        gap: 40,
    },
    tireWrap: {
        alignItems: 'center',
    },
    psiVal: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter_700Bold',
    },
    psiUnit: {
        fontSize: 10,
        color: '#6B7280',
    },
    tireDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginTop: 6,
    },
    carOutlineSil: {
        opacity: 0.8,
    }
});
