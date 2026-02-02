import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Main Content */}
            <View style={styles.mainContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('@/assets/images/welcome_image.png')}
                        style={styles.illustration}
                        contentFit="cover"
                    />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Rent a car. Ride safe.</Text>
                        <Text style={styles.subtitle}>
                            Quick bookings, verified drivers, and flexible payments. All in one app.
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.signInButton}
                            onPress={() => {
                                // Redirect to sign in page
                                router.push('/sign-in');
                            }}
                        >
                            <Text style={styles.signInText}>Sign in</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.getStartedButton}
                            onPress={() => router.push('/home')}
                        >
                            <Text style={styles.getStartedText}>Get started</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 12,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brandName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        fontFamily: 'System',
    },
    supportButton: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    supportText: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '600',
    },
    content: {
        // Deprecated, replaced by mainContainer and contentContainer
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    imageContainer: {
        width: '100%',
        flex: 1, // Take available space
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustration: {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 20,
    },
    signInButton: {
        backgroundColor: '#1C1C1E', // Dark black/grey
        width: '100%',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    signInText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    getStartedButton: {
        backgroundColor: '#F3F4F6',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    getStartedText: {
        color: '#1F2937',
        fontSize: 16,
        fontWeight: '600',
    },
});
