import { Timestamp } from "firebase/firestore";

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    userEmail: string;
    createdAt: Date | Timestamp;
}

export type TodoListProps = {
    todos: Todo[];
    onTodoUpdated: () => void;
};

export type AddTodoFormProps = {
    onTodoAdded: () => void;
};

