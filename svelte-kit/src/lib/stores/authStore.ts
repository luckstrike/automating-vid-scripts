import { createUserWithEmailAndPassword, 
        signOut, 
        sendPasswordResetEmail, 
        updateEmail, 
        updatePassword,
        signInWithEmailAndPassword,
        verifyBeforeUpdateEmail } from 'firebase/auth';

import { writable } from 'svelte/store';    
import { auth } from '$lib/firebase/firebase.client';
import type { User } from 'firebase/auth';

export const authStore = writable<{ isLoading: boolean, currentUser: User | null}>({
    isLoading: true,
    currentUser: null,
});

export const authHandlers = {
    login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    },
    signup: async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    },
    logout: async () => {
        await signOut(auth);
    },
    resetPassword: async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    },
    updateEmail: async (email: string) => {
        if (!auth.currentUser) {
            throw new Error('No current user');
        } else {
            // Sends a verification email to the new email address
            await verifyBeforeUpdateEmail(auth.currentUser, email);
            authStore.update((curr: any) => {
                // Ensure that curr.currentUser is an object before trying to spread it
                const currentUser = curr.currentUser ? {...curr.currentUser} : {};
    
                return {
                    ...curr,
                    currentUser: {
                        ...currentUser, 
                        email: email
                    }
                };
            });

            alert('A verification email has been sent to your new email address. Please verify your email address before logging in again.')
            
            // await updateEmail(auth.currentUser, email);
        }
    },
    updatePassword: async (password: string) => {
        if (!auth.currentUser) {
            throw new Error('No current user');
        } else {
            await updatePassword(auth.currentUser, password);
        }
    }
}