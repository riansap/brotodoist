import { db } from '../firebase';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
    serverTimestamp,
    DocumentReference,
    QueryDocumentSnapshot,
    Timestamp,
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { Todo } from '@/types/todo';

const COLLECTION_NAME = 'todos';

class TodoServiceError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'TodoServiceError';
    }
}

const handleFirestoreError = (error: unknown): never => {
    if (error instanceof FirebaseError) {
        throw new TodoServiceError(
            error.message || 'Firestore operation failed',
            error.code
        );
    }
    throw new TodoServiceError('An unexpected error occurred');
};

export const fetchTodos = async (userEmail: string): Promise<Todo[]> => {
    try {
        if (!userEmail) {
            throw new TodoServiceError('User email is required');
        }

        const todosRef = collection(db, COLLECTION_NAME);
        const q = query(
            todosRef,
            where('userEmail', '==', userEmail),
            orderBy("completed", "asc"),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
            const data = doc.data() as {
                text: string;
                completed: boolean;
                userEmail: string;
                createdAt?: Timestamp;
            };

            return {
                id: doc.id,
                text: data.text,
                completed: data.completed,
                userEmail: data.userEmail,
                createdAt: data.createdAt?.toDate() ?? new Date(),
            };
        });
    } catch (error) {
        return handleFirestoreError(error);
    }
};

export const addTodo = async (text: string, userEmail: string): Promise<Todo> => {
    try {
        if (!text?.trim()) {
            throw new TodoServiceError('Todo text is required');
        }
        if (!userEmail) {
            throw new TodoServiceError('User email is required');
        }

        const todosRef = collection(db, COLLECTION_NAME);
        const newTodo = {
            text: text.trim(),
            completed: false,
            userEmail,
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(todosRef, newTodo);

        return {
            id: docRef.id,
            text: newTodo.text,
            completed: newTodo.completed,
            userEmail: newTodo.userEmail,
            createdAt: new Date(), // approximate; better to fetch again if needed
        };
    } catch (error) {
        return handleFirestoreError(error);
    }
};

export const updateTodo = async (id: string, completed: boolean): Promise<void> => {
    try {
        if (!id) {
            throw new TodoServiceError('Todo ID is required');
        }

        const todoRef: DocumentReference = doc(db, COLLECTION_NAME, id);
        await updateDoc(todoRef, {
            completed,
        });
    } catch (error) {
        return handleFirestoreError(error);
    }
};

export const deleteTodo = async (id: string): Promise<void> => {
    try {
        if (!id) {
            throw new TodoServiceError('Todo ID is required');
        }

        const todoRef: DocumentReference = doc(db, COLLECTION_NAME, id);
        await deleteDoc(todoRef);
    } catch (error) {
        return handleFirestoreError(error);
    }
};
