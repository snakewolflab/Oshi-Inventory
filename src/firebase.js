import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAQ-zIzThey0CPj1zWsUtlKZlWGdOxhy_0",
    authDomain: "oshi-project-with-snakewolf.firebaseapp.com",
    projectId: "oshi-project-with-snakewolf",
    storageBucket: "oshi-project-with-snakewolf.firebasestorage.app",
    messagingSenderId: "270771883613",
    appId: "1:270771883613:web:43fb9630e3fc6dcd8087b4",
    measurementId: "G-Z166V2BCL3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);