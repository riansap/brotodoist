import { User } from "firebase/auth";
import { AppUser } from "@/types/user";
import { Todo } from "@/types/todo";
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';


export function mapFirebaseUser(user: User): AppUser {
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
    };
}

export function mapFirestoreDocToTodo(doc: QueryDocumentSnapshot<DocumentData>): Todo {
    const data = doc.data();
    return {
        id: doc.id,
        text: data.text,
        completed: data.completed,
        createdAt: data.createdAt?.toDate(),
        userEmail: data.userEmail, // Sesuaikan dengan nama field Anda
    };
}