import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTodo } from "../services/todo.service";
import { toast } from "sonner";
import { useFirebaseAuthSync } from "./useFirebaseAuthSync";

/**
 * Custom hook to add a new todo item for a specific user.
 *
 * Utilizes a mutation to send a request to add a todo item in the backend.
 * Automatically invalidates the todos query cache upon success to update the UI.
 * Displays success and error notifications based on the mutation's result.
 *
 * @param {string | null | undefined} userEmail - The email of the user for whom the todo is being added.
 * @returns The mutation result object, which allows for controlling the mutation flow and accessing the mutation state.
 */

export function useAddTodo(userEmail: string | null | undefined) {
    const queryClient = useQueryClient();
    const isFirebaseReady = useFirebaseAuthSync();

    return useMutation({
        mutationFn: async (text: string) => {
            if (!isFirebaseReady) {
                throw new Error("Firebase authentication is not ready");
            }
            return addTodo(text, userEmail!);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", userEmail] });
            toast.success("Task added successfully!");
        },
        onError: (error) => {
            console.error("Add todo error:", error);
            if (error.message === "Firebase authentication is not ready") {
                toast.error("Please wait while we prepare your session...");
            } else {
                toast.error("Failed to add task. Please try again.");
            }
        },
    });
}
