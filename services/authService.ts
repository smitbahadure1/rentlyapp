import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged as fbOnAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Explicitly cache session for offline bypass
    await AsyncStorage.setItem('user_session', JSON.stringify({ uid: userCredential.user.uid, email: userCredential.user.email }));
    return userCredential.user;
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Explicitly cache session for offline bypass
    await AsyncStorage.setItem('user_session', JSON.stringify({ uid: userCredential.user.uid, email: userCredential.user.email }));
    return userCredential.user;
}

/**
 * Sign out
 */
export async function signOut() {
    await fbSignOut(auth);
    await AsyncStorage.removeItem('user_session');
}

/**
 * Get current session
 */
export async function getSession() {
    const user = auth.currentUser;
    if (user) return user;

    // Fallback: Check local storage
    const cachedSession = await AsyncStorage.getItem('user_session');
    if (cachedSession) {
        // We're offline or waiting on firebase auth to boot, return a stub user object that works
        return JSON.parse(cachedSession);
    }

    return null;
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return fbOnAuthStateChanged(auth, async (user) => {
        if (user) {
            await AsyncStorage.setItem('user_session', JSON.stringify({ uid: user.uid, email: user.email }));
        }
        callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user);
    });
}
