import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

const SETTINGS_CONTENT: any = {
    personal: {
        title: 'Personal Information',
        sections: [
            {
                label: 'PROFILE DETAILS',
                items: [
                    { label: 'Full Name', value: '', type: 'text' },
                    { label: 'Email', value: '', type: 'text' },
                    { label: 'Phone', value: '', type: 'text' },
                    { label: 'Date of Birth', value: '', type: 'text' },
                ]
            },
            {
                label: 'DOCUMENTATION',
                items: [
                    { label: 'Driver\'s License', value: 'Not Verified', type: 'status', icon: 'alert-circle' },
                    { label: 'Identity Proof', value: 'Not Verified', type: 'status', icon: 'alert-circle' },
                ]
            }
        ]
    },
    security: {
        title: 'Login & Security',
        sections: [
            {
                label: 'AUTHENTICATION',
                items: [
                    { label: 'Change Password', value: 'Never changed', type: 'link' },
                    { label: 'Two-Factor Auth', value: false, type: 'switch' },
                    { label: 'Biometric Login', value: false, type: 'switch' },
                ]
            },
            {
                label: 'DEVICES',
                items: []
            }
        ]
    },
    payments: {
        title: 'Payments & Payouts',
        sections: [
            {
                label: 'PAYMENT METHODS',
                items: []
            },
            {
                label: 'TRANSACTIONS',
                items: [
                    { label: 'Payment History', value: '', type: 'link' },
                    { label: 'Credits & Refunds', value: '₹0.00', type: 'text' },
                ]
            }
        ]
    },
    settings: {
        title: 'App Settings',
        sections: [
            {
                label: 'PREFERENCES',
                items: [
                    { label: 'Currency', value: 'INR (₹)', type: 'link' },
                    { label: 'Language', value: 'English', type: 'link' },
                    { label: 'Appearance', value: 'Dark Mode', type: 'link' },
                ]
            },
            {
                label: 'DATA',
                items: [
                    { label: 'Clear Cache', value: '0 MB', type: 'link' },
                    { label: 'Download Data', value: '', type: 'link' },
                ]
            }
        ]
    },
    notifications: {
        title: 'Notifications',
        sections: [
            {
                label: 'PUSH NOTIFICATIONS',
                items: [
                    { label: 'Booking Updates', value: true, type: 'switch' },
                    { label: 'Promotions', value: false, type: 'switch' },
                    { label: 'Account Alerts', value: true, type: 'switch' },
                ]
            }
        ]
    },
    membership: {
        title: 'Membership Benefits',
        sections: [
            {
                label: 'CURRENT STATUS',
                items: [
                    { label: 'Tier', value: 'Standard', type: 'text' },
                    { label: 'Next Reward', value: 'Unlocked on first ride', type: 'text' },
                ]
            },
            {
                label: 'ACTIVE PERKS',
                items: []
            }
        ]
    }
};

export default function SettingsDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const content = SETTINGS_CONTENT[id as string] || SETTINGS_CONTENT.settings;

    const [switches, setSwitches] = useState<any>({});

    const toggleSwitch = (label: string) => {
        setSwitches((prev: any) => ({ ...prev, [label]: !prev[label] }));
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{content.title}</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {content.sections.map((section: any, sIdx: number) => (
                        <View key={sIdx} style={styles.section}>
                            <Text style={styles.sectionLabel}>{section.label}</Text>
                            <View style={styles.card}>
                                {section.items.map((item: any, iIdx: number) => (
                                    <View key={iIdx}>
                                        <TouchableOpacity
                                            style={styles.itemRow}
                                            disabled={item.type === 'text' || item.type === 'status'}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.itemLeft}>
                                                {item.icon && (
                                                    <View style={styles.iconBox}>
                                                        <Ionicons name={item.icon} size={18} color="#9CA3AF" />
                                                    </View>
                                                )}
                                                <Text style={styles.itemLabel}>{item.label}</Text>
                                            </View>

                                            <View style={styles.itemRight}>
                                                {item.type === 'text' && (
                                                    <Text style={styles.itemValue}>{item.value}</Text>
                                                )}
                                                {item.type === 'status' && (
                                                    <View style={styles.statusBadge}>
                                                        <Ionicons name={item.icon || 'checkmark-circle'} size={14} color="#10B981" />
                                                        <Text style={styles.statusText}>{item.value}</Text>
                                                    </View>
                                                )}
                                                {item.type === 'link' && (
                                                    <View style={styles.linkRow}>
                                                        {item.value ? <Text style={styles.itemValueText}>{item.value}</Text> : null}
                                                        <Ionicons name="chevron-forward" size={16} color="#4B5563" />
                                                    </View>
                                                )}
                                                {item.type === 'switch' && (
                                                    <Switch
                                                        value={switches[item.label] ?? item.value}
                                                        onValueChange={() => toggleSwitch(item.label)}
                                                        trackColor={{ false: '#333', true: '#FFF' }}
                                                        thumbColor={Platform.OS === 'ios' ? '#FFF' : '#FFF'}
                                                        ios_backgroundColor="#333"
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                        {iIdx < section.items.length - 1 && <View style={styles.divider} />}
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.saveBtn}>
                        <Text style={styles.saveBtnText}>Update Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
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
        backgroundColor: '#1C1C1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Inter_700Bold',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    sectionLabel: {
        color: '#6B7280',
        fontSize: 11,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 2,
        marginBottom: 16,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 18,
        minHeight: 64,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#27272A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        color: '#FFF',
        fontSize: 15,
        fontFamily: 'Inter_500Medium',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemValue: {
        color: '#9CA3AF',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    itemValueText: {
        color: '#9CA3AF',
        fontSize: 13,
        marginRight: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#10B981',
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginHorizontal: 20,
    },
    saveBtn: {
        backgroundColor: '#FFF',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    saveBtnText: {
        color: '#000',
        fontSize: 15,
        fontFamily: 'Inter_800ExtraBold',
        letterSpacing: 1,
    }
});
