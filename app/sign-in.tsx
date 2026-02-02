import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Background Section (Top Half) */}
            <ImageBackground
                source={require('@/assets/images/sign_in_header.png')}
                style={styles.backgroundImage}
                contentFit="cover"
            >
                <View style={styles.overlay}>
                    <SafeAreaView style={styles.headerSafeArea}>
                        {/* Branding removed as requested */}
                    </SafeAreaView>
                </View>
            </ImageBackground>

            {/* Form Section (Bottom Half) */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.formSection}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Ready to ride?</Text>

                    {/* Email Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g email@example.com"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Phone Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone number</Text>
                        <View style={[styles.input, styles.phoneInputContainer]}>
                            <TouchableOpacity style={styles.countryCode}>
                                {/* Placeholder for flag/icon if needed, using text for now or an icon */}
                                <Ionicons name="flag-outline" size={16} color="#111827" />
                                <Text style={styles.countryCodeText}>+234</Text>
                                <Ionicons name="chevron-down" size={12} color="#6B7280" />
                            </TouchableOpacity>
                            <View style={styles.separator} />
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="e.g (234) 708 829 9201"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={() => {
                            router.push('/home');
                        }}
                    >
                        <Text style={styles.signInText}>Sign in</Text>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>Book cars instantly. Pay flexibly. Ride safe.</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Or match the bottom card color
    },
    backgroundImage: {
        height: '45%', // Takes up the top portion
        width: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay for text readability
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerSafeArea: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    brandName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    formSection: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -24, // Overlap the background slightly
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F2937',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 0, // Reset vertical padding for container
        height: 52, // Fixed height to match other inputs
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        gap: 4,
    },
    countryCodeText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    separator: {
        width: 1,
        height: '50%',
        backgroundColor: '#D1D5DB',
        marginHorizontal: 12,
    },
    phoneInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#1F2937',
    },
    signInButton: {
        backgroundColor: '#1C1C1E',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    signInText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#6B7280',
    },
});
