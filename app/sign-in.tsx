import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useCallback } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { upsertUser } from '@/services/supabaseService';

export default function SignInScreen() {
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSignInPress = useCallback(async () => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, emailAddress, password);
            const user = userCredential.user;

            // Sync user to Backend (Firebase Firestore will be handled via services)
            await upsertUser({
                id: user.uid,
                email: user.email || '',
                full_name: user.displayName || '',
                avatar_url: user.photoURL || '',
            });

            router.replace('/(tabs)/home');
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            Alert.alert("Authentication Failed", err.message || "Check your credentials and try again.");
        } finally {
            setIsLoading(false);
        }
    }, [emailAddress, password, router]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Premium Header with Image */}
            <View style={styles.headerSection}>
                <Image
                    source={require('@/assets/images/sign_in_header.png')}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)', '#000']}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={styles.safeArea}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerSubtitle}>WELCOME BACK</Text>
                        <Text style={styles.headerTitle}>Sign In</Text>
                    </View>
                </SafeAreaView>
            </View>

            {/* Form Section */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.formSection}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. alex@rently.pro"
                                    placeholderTextColor="#4B5563"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={emailAddress}
                                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#4B5563"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={(password) => setPassword(password)}
                                />
                                <TouchableOpacity>
                                    <Ionicons name="eye-outline" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.forgotBtn}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.signInButton, isLoading && { opacity: 0.7 }]}
                        onPress={onSignInPress}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <>
                                <Text style={styles.signInText}>ENTER THE FLEET</Text>
                                <Ionicons name="chevron-forward" size={18} color="#000" />
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/sign-up' as any)}>
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Admin Access Button */}
                    <TouchableOpacity
                        style={styles.adminButton}
                        onPress={() => router.push('/admin-sign-in' as any)}
                    >
                        <Ionicons name="shield-checkmark" size={16} color="#000" />
                        <Text style={styles.adminButtonText}>Admin Access</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerSection: {
        height: '40%',
        width: '100%',
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 30,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    headerTextContainer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
    },
    headerSubtitle: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 3,
        opacity: 0.6,
        marginBottom: 8,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 42,
        fontFamily: 'Inter_900Black',
        letterSpacing: -1,
    },
    formSection: {
        flex: 1,
        backgroundColor: '#000',
        marginTop: -20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
    },
    scrollContent: {
        paddingTop: 40,
        paddingBottom: 40,
    },
    inputContainer: {
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 10,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 2,
        marginBottom: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 60,
        borderWidth: 1,
        borderColor: '#27272A',
        gap: 12,
    },
    input: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontFamily: 'Inter_600SemiBold',
    },
    signInButton: {
        backgroundColor: '#FFF',
        height: 64,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 30,
    },
    signInText: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'Inter_900Black',
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    signUpText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Inter_700Bold',
    },
    adminButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#F59E0B',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    adminButtonText: {
        color: '#000',
        fontSize: 13,
        fontFamily: 'Inter_600SemiBold',
    },
});
