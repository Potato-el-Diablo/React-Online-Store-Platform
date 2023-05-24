// useUserAuth.js
import { useState, useEffect } from 'react';
import {getDocs, collection, query, where} from 'firebase/firestore';
import {auth, db} from './firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

const useUserAuth = () => {
    const [userId, setUserId] = useState('');
    const [isSeller, setIsSeller] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Check if the user is a seller
                const sellerRef = collection(db, "sellers");
                const q = query(sellerRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);

                // If the user is a seller, set isSeller to true
                if (!querySnapshot.empty) {
                    setIsSeller(true);
                } else {
                    setIsSeller(false);
                }
            } else {
                // If the user is not logged in, reset states
                setIsSeller(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId('');
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return { userId, isSeller };
};

export default useUserAuth;
