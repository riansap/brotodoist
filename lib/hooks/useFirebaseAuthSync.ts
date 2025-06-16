"use client";

import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Hook to sync Firebase auth with Next Auth session.
 * Uses the `id_token` from the Next Auth session to authenticate with Firebase.
 * Returns a boolean indicating whether the Firebase auth is ready.
 *
 * @returns {boolean} Whether the Firebase auth is ready.
 */
export function useFirebaseAuthSync(): boolean {
    const { data: session, status } = useSession();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (status !== "authenticated" || !session?.id_token) return;

        const auth = getAuth();

        if (auth.currentUser) {
            setReady(true);
            return;
        }

        const syncAuth = async () => {
            try {
                auth.useDeviceLanguage();
                const credential = GoogleAuthProvider.credential(session.id_token);

                const userCredential = await signInWithCredential(auth, credential);
                console.log("Firebase login success:", userCredential.user.email);
                setReady(true);
            } catch (err) {
                console.error("Firebase login failed:", err);
                setReady(false);
            }
        };

        syncAuth();
    }, [session?.id_token, status]);

    return ready;
}
