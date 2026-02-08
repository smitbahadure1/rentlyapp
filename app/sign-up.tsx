import { useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle submission of signup form
    const onSignUpPress = async () => {
        if (!isLoaded) return;
        setIsLoading(true);


        try {
            await signUp.create({
                emailAddress,
                password,
            });

            // Send verification email
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            // Display verification form
            setPendingVerification(true);
        } catch (err: any) {
            console.log(JSON.stringify(err, null, 2));
            const errorMsg = err.errors ? err.errors.map((e: any) => e.longMessage).join('\n') : "Check your details and try again.";
            Alert.alert("Sign Up Failed", errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle submission of verification form
    const onPressVerify = async () => {
        if (!isLoaded) return;
        setIsLoading(true);


        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                router.replace('/(tabs)/home');
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
                Alert.alert("Error", "Completion status not valid.");
            }
        } catch (err: any) {
            console.log(JSON.stringify(err, null, 2));
            const errorMsg = err.errors ? err.errors.map((e: any) => e.longMessage).join('\n') : "Incorrect code.";
            Alert.alert("Verification Failed", errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

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
                        <Text style={styles.headerSubtitle}>JOIN THE FLEET</Text>
                        <Text style={styles.headerTitle}>{pendingVerification ? 'Verify' : 'Sign Up'}</Text>
                    </View>
                </SafeAreaView>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.formSection}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {!pendingVerification ? (
                        <>
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
                                            onChangeText={setEmailAddress}
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
                                            onChangeText={setPassword}
                                        />
                                    </View>
                                </View>
                            </View>



                            <TouchableOpacity
                                style={[styles.signInButton, isLoading && { opacity: 0.7 }]}
                                onPress={onSignUpPress}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                {isLoading ? <ActivityIndicator color="#000" /> : (
                                    <>
                                        <Text style={styles.signInText}>CREATE ACCOUNT</Text>
                                        <Ionicons name="chevron-forward" size={18} color="#000" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>VERIFICATION CODE</Text>
                                    <View style={styles.inputWrapper}>
                                        <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="123456"
                                            placeholderTextColor="#4B5563"
                                            keyboardType="number-pad"
                                            value={code}
                                            onChangeText={setCode}
                                        />
                                    </View>
                                    <Text style={styles.helperText}>Enter the code sent to your email.</Text>
                                </View>
                            </View>



                            <TouchableOpacity
                                style={[styles.signInButton, isLoading && { opacity: 0.7 }]}
                                onPress={onPressVerify}
                                disabled={isLoading}
                                activeOpacity={0.8}
                            >
                                {isLoading ? <ActivityIndicator color="#000" /> : (
                                    <>
                                        <Text style={styles.signInText}>VERIFY EMAIL</Text>
                                        <Ionicons name="chevron-forward" size={18} color="#000" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/sign-in' as any)}>
                            <Text style={styles.signUpText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
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
    helperText: {
        color: '#6B7280',
        fontSize: 12,
        marginTop: 8,
        fontFamily: 'Inter_500Medium',
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
    errorContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.5)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        flex: 1,
    }
});
