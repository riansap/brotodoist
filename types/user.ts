export type AppUser = {
    uid: string;
    email: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    emailVerified: boolean;
};
