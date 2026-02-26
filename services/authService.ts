import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged as fbOnAuthStateChanged } from 'firebase/auth';

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

/**
 * Sign out
 */
export async function signOut() {
    await fbSignOut(auth);
}

/**
 * Get current session
 */
export async function getSession() {
    return auth.currentUser;
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return fbOnAuthStateChanged(auth, (user) => {
        callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user);
    });
}
