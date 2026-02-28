import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyD9YNPSXm1jof-vq6hRzzVaCbstX7N6L-M",
    authDomain: "rently-eab84.firebaseapp.com",
    projectId: "rently-eab84",
    storageBucket: "rently-eab84.firebasestorage.app",
    messagingSenderId: "636124435867",
    appId: "1:636124435867:web:074387965cb987c5a73d3e",
    measurementId: "G-XDSHJ2N7B7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
});
export const storage = getStorage(app);
