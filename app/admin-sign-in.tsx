import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useCallback } from 'react';
import { adminSignIn } from '@/services/adminService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminSignInScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onAdminSignInPress = useCallback(async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        setIsLoading(true);
        try {
            const adminUser = await adminSignIn(email, password);

            if (adminUser) {
                // Store admin session
                await AsyncStorage.setItem('admin_user', JSON.stringify(adminUser));
                Alert.alert("Success", "Welcome Admin!", [
                    {
                        text: "OK",
                        onPress: () => router.replace('/admin/dashboard' as any)
                    }
                ]);
            } else {
                Alert.alert("Authentication Failed", "Invalid admin credentials. Please try again.");
            }
        } catch (err: any) {
            console.error('Admin sign in error:', err);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [email, password]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Premium Header */}
            <View style={styles.headerSection}>
                <LinearGradient
                    colors={['#1a1a1a', '#000000']}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={styles.safeArea}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <View style={styles.adminBadge}>
                            <Ionicons name="shield-checkmark" size={20} color="#FFF" />
                            <Text style={styles.adminBadgeText}>ADMIN ACCESS</Text>
                        </View>
                        <Text style={styles.headerTitle}>Admin Portal</Text>
                        <Text style={styles.headerSubtitle}>Secure Management Dashboard</Text>
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
                            <Text style={styles.label}>ADMIN EMAIL</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="admin@rently.com"
                                    placeholderTextColor="#6B7280"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>ADMIN PASSWORD</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#6B7280"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color="#6B7280"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.securityNote}>
                            <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                            <Text style={styles.securityText}>
                                This is a secure admin portal. Unauthorized access is prohibited.
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.signInButton, isLoading && { opacity: 0.7 }]}
                        onPress={onAdminSignInPress}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <>
                                <Ionicons name="shield-checkmark" size={20} color="#000" />
                                <Text style={styles.signInText}>ACCESS ADMIN PANEL</Text>
                                <Ionicons name="chevron-forward" size={18} color="#000" />
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Ionicons name="lock-closed" size={14} color="#6B7280" />
                        <Text style={styles.footerText}>Secured with enterprise-grade encryption</Text>
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
        height: '35%',
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
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    headerTextContainer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
    },
    adminBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#333',
    },
    adminBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 1.5,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 38,
        fontFamily: 'Inter_900Black',
        letterSpacing: -1,
        marginBottom: 8,
    },
    headerSubtitle: {
        color: '#9CA3AF',
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
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
        borderColor: '#333',
        gap: 12,
    },
    input: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#1C1C1E',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    securityText: {
        flex: 1,
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    signInButton: {
        backgroundColor: '#FFF',
        height: 64,
        borderRadius: 16,
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
        gap: 6,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
});
