import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { getCarData } from '@/services/carDataStore';

const { width } = Dimensions.get('window');

const STEPS = ['FRONT', 'LEFT', 'REAR', 'RIGHT', 'INTERIOR'];

export default function VirtualInspection() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [storedCar, setStoredCar] = useState<any>(null);
    const [activeStep, setActiveStep] = useState(0);
    const [hotspots, setHotspots] = useState<any[]>([]);

    useEffect(() => {
        let car = getCarData(id as string);

        // Fallback for demo car 'c1'
        if (!car && id === 'c1') {
            car = {
                id: 'c1',
                brand: 'Porsche',
                model: '911 Carrera',
            };
        }

        setStoredCar(car);
    }, [id]);

    const handleAddHotspot = (e: any) => {
        const { locationX, locationY } = e.nativeEvent;
        setHotspots([...hotspots, { x: locationX, y: locationY, step: STEPS[activeStep] }]);
    };

    const nextStep = () => {
        if (activeStep < STEPS.length - 1) setActiveStep(activeStep + 1);
        else router.push(`/active-trip/${id}` as any);
    };

    if (!storedCar) return null;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.content}>

                {/* Instruction */}
                <View style={styles.instructionBox}>
                    <Text style={styles.stepLabel}>STEP 0{activeStep + 1}</Text>
                    <Text style={styles.instructionTitle}>Inspect the {STEPS[activeStep]}</Text>
                    <Text style={styles.instructionSub}>Tap any areas with visible damage or scratches</Text>
                </View>

                {/* Active Viewfinder Area */}
                <View style={styles.viewfinderContainer}>
                    {/* Simulated Camera Feed */}
                    <View style={styles.cameraFeed}>
                        <View style={styles.cameraFrame} />
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerTR} />
                        <View style={styles.cornerBL} />
                        <View style={styles.cornerBR} />

                        <Ionicons name="scan-outline" size={100} color="rgba(255,255,255,0.1)" />
                    </View>

                    {/* Interactive Shell / Wireframe Overlay */}
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.wireframeOverlay}
                        onPress={handleAddHotspot}
                    >
                        {/* Simple Wireframe Representation based on Step */}
                        <View style={styles.carShell}>
                            <Ionicons
                                name={activeStep === 4 ? "apps-outline" : "car-outline"}
                                size={220}
                                color="rgba(255,255,255,0.05)"
                            />
                        </View>

                        {/* Hotspots */}
                        {hotspots.filter(h => h.step === STEPS[activeStep]).map((h, i) => (
                            <View key={i} style={[styles.hotspot, { left: h.x - 12, top: h.y - 12 }]}>
                                <View style={styles.hotspotInner} />
                            </View>
                        ))}
                    </TouchableOpacity>
                </View>

                {/* Bottom Bar */}
                <View style={styles.footer}>
                    <View style={styles.summaryInfo}>
                        <Text style={styles.issueCount}>{hotspots.length} issues marked</Text>
                        <Text style={styles.statusText}>Live Verification Active</Text>
                    </View>

                    <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
                        <Text style={styles.nextBtnText}>
                            {activeStep === STEPS.length - 1 ? 'COMPLETE' : 'PHOTO TAKEN'}
                        </Text>
                        <Ionicons name="arrow-forward" size={18} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Top Hub - Absolute on Top, placed at end of JSX to ensure touch priority */}
            <SafeAreaView style={styles.headerAbsolute} edges={['top']} pointerEvents="box-none">
                <View style={styles.header} pointerEvents="box-none">
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => router.replace('/(tabs)/bookings')}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.stepProgress}>
                        {STEPS.map((_, i) => (
                            <View
                                key={i}
                                style={[styles.progressDot, i <= activeStep && styles.progressDotActive]}
                            />
                        ))}
                    </View>
                    <View style={{ width: 44 }} />
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
    safeArea: {
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
    content: {
        flex: 1,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepProgress: {
        flexDirection: 'row',
        gap: 8,
    },
    progressDot: {
        width: 20,
        height: 3,
        backgroundColor: '#333',
        borderRadius: 2,
    },
    progressDotActive: {
        backgroundColor: '#FFF',
    },
    instructionBox: {
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 30,
    },
    stepLabel: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 2,
        marginBottom: 8,
    },
    instructionTitle: {
        color: '#FFF',
        fontSize: 28,
        fontFamily: 'Inter_900Black',
        marginBottom: 8,
    },
    instructionSub: {
        color: '#9CA3AF',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    viewfinderContainer: {
        flex: 1,
        marginHorizontal: 20,
        borderRadius: 40,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#0A0A0A',
        borderWidth: 1,
        borderColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraFeed: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraFrame: {
        width: '85%',
        height: '70%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderStyle: 'dashed',
    },
    cornerTL: { position: 'absolute', top: 30, left: 30, width: 20, height: 20, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#FFF' },
    cornerTR: { position: 'absolute', top: 30, right: 30, width: 20, height: 20, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#FFF' },
    cornerBL: { position: 'absolute', bottom: 30, left: 30, width: 20, height: 20, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#FFF' },
    cornerBR: { position: 'absolute', bottom: 30, right: 30, width: 20, height: 20, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#FFF' },
    wireframeOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },
    carShell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hotspot: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(239, 68, 68, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    hotspotInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    footer: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#000',
    },
    summaryInfo: {
        flex: 1,
    },
    issueCount: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    statusText: {
        color: '#6B7280',
        fontSize: 12,
        marginTop: 4,
    },
    nextBtn: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 20,
        gap: 8,
    },
    nextBtnText: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'Inter_800ExtraBold',
    }
});
