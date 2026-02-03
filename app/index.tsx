import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, ViewToken, BackHandler } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@clerk/clerk-expo';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    useAnimatedScrollHandler,
    FadeIn,
    FadeInDown
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
    {
        id: '01',
        label: 'PERFORMANCE',
        title: 'THE ELITE\nCOLLECTION',
        subtitle: 'Handpicked masterpiece vehicles for those who demand absolute perfection.',
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '02',
        label: 'PRECISION',
        title: 'INSTANT\nACCESS',
        subtitle: 'Zero friction. Total control. Book any vehicle in under sixty seconds.',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '03',
        label: 'PRIVILEGE',
        title: 'BEYOND\nTHE DRIVE',
        subtitle: 'Experience concierge-level service tailored to your personal requirements.',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop',
    }
];

export default function OnboardingScreen() {
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null);

    // Redirect if already signed in
    useEffect(() => {
        if (isSignedIn) {
            router.replace('/(tabs)/home');
        }
    }, [isSignedIn]);

    // Handle Phone's Back Button Integration
    useEffect(() => {
        const backAction = () => {
            if (activeIndex > 0) {
                flatListRef.current?.scrollToIndex({ index: activeIndex - 1, animated: true });
                return true; // Prevents the app from closing
            }
            return false; // Default behavior (exit app)
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [activeIndex]);

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollX.value = event.contentOffset.x;
    });

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index || 0);
        }
    }).current;

    const renderItem = ({ item, index }: { item: typeof ONBOARDING_DATA[0], index: number }) => {
        return (
            <View style={styles.page}>
                <Animated.View
                    entering={FadeIn.duration(1000)}
                    style={StyleSheet.absoluteFill}
                >
                    <Image
                        source={{ uri: item.image }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                        transition={1000}
                    />
                </Animated.View>

                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', '#000']}
                    style={StyleSheet.absoluteFill}
                />

                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.textContainer}>
                        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.labelWrapper}>
                            <View style={styles.labelLine} />
                            <Text style={styles.labelText}>{item.label}</Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                            <Text style={styles.titleText}>{item.title}</Text>
                            <View style={styles.subtitleWrapper}>
                                <Text style={styles.subtitleText}>{item.subtitle}</Text>
                            </View>
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <Animated.FlatList
                ref={flatListRef}
                data={ONBOARDING_DATA}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                keyExtractor={(item) => item.id}
            />

            <SafeAreaView style={styles.overlay} pointerEvents="box-none">
                <View style={styles.header}>
                    <TouchableOpacity
                        onLongPress={() => router.push('/admin-sign-in' as any)}
                        delayLongPress={2000}
                    >
                        <Text style={styles.brandText}>RENTLY <Text style={styles.brandAccent}>PRO</Text></Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/sign-in')}>
                        <Text style={styles.skipText}>SKIP</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <View style={styles.pagination}>
                        <Text style={styles.pagerNumber}>{`0${activeIndex + 1}`}</Text>
                        <View style={styles.pagerLineBg}>
                            {ONBOARDING_DATA.map((_, i) => {
                                const dotStyle = useAnimatedStyle(() => {
                                    const input = [(i - 1) * width, i * width, (i + 1) * width];
                                    const opacity = interpolate(scrollX.value, input, [0.1, 1, 0.1], Extrapolate.CLAMP);
                                    return {
                                        opacity,
                                        width: interpolate(scrollX.value, input, [width / 10, width / 5, width / 10], Extrapolate.CLAMP)
                                    };
                                });
                                return <Animated.View key={i} style={[styles.pageIndicator, dotStyle]} />;
                            })}
                        </View>
                        <Text style={styles.pagerNumber}>03</Text>
                    </View>



                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => {
                            if (activeIndex === ONBOARDING_DATA.length - 1) {
                                router.push('/sign-in');
                            } else {
                                flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
                            }
                        }}
                    >
                        <View style={styles.innerBtn}>
                            <Text style={styles.btnText}>
                                {activeIndex === ONBOARDING_DATA.length - 1 ? 'ENTER EXPERIENCE' : 'NEXT'}
                            </Text>
                            <Ionicons
                                name={activeIndex === ONBOARDING_DATA.length - 1 ? "arrow-forward" : "chevron-forward"}
                                size={20}
                                color="#000"
                            />
                        </View>
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
    page: {
        width,
        height,
    },
    safeArea: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        height: 60,
    },
    brandText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Inter_900Black',
        letterSpacing: 2,
    },
    brandAccent: {
        color: '#FFF',
        opacity: 0.5,
    },
    skipText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        opacity: 0.4,
        letterSpacing: 2,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 40,
        marginTop: 100,
    },
    labelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    labelLine: {
        width: 30,
        height: 1,
        backgroundColor: '#FFF',
        opacity: 0.5,
    },
    labelText: {
        color: '#FFF',
        fontSize: 11,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 4,
        opacity: 0.8,
    },
    titleText: {
        color: '#FFF',
        fontSize: 52,
        fontFamily: 'Inter_900Black',
        lineHeight: 56,
        marginBottom: 20,
        letterSpacing: -2,
    },
    subtitleWrapper: {
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.15)',
        paddingLeft: 20,
    },
    subtitleText: {
        color: '#9CA3AF',
        fontSize: 15,
        fontFamily: 'Inter_400Regular',
        lineHeight: 24,
        letterSpacing: 0.5,
    },
    footer: {
        paddingHorizontal: 30,
        paddingBottom: 50,
        gap: 30,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    pagerNumber: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        opacity: 0.4,
    },
    pagerLineBg: {
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    },
    pageIndicator: {
        height: 1,
        backgroundColor: '#FFF',
    },
    actionBtn: {
        width: '100%',
        backgroundColor: '#FFF',
        height: 64,
        borderRadius: 2,
        overflow: 'hidden',
    },
    innerBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    btnText: {
        color: '#000',
        fontSize: 13,
        fontFamily: 'Inter_900Black',
        letterSpacing: 2,
    },

});
