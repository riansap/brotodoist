// lib/hooks/useDeleteTodo.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "../services/todo.service";
import { toast } from "sonner";
import { useFirebaseAuthSync } from "./useFirebaseAuthSync";

/**
 * Custom hook to delete a todo item.
 *
 * This hook uses a mutation to delete a todo from the database.
 * On a successful deletion, it invalidates the "todos" query cache
 * for the specified user email, prompting a refetch of todos.
 * Displays a success toast on success and an error toast on failure.
 *
 * @param userEmail - The email of the user whose todos are being managed.
 *                    If null or undefined, the hook will not attempt to refetch todos.
 * @returns A mutation object for deleting a todo.
 */

export function useDeleteTodo(userEmail: string | null | undefined) {
    const queryClient = useQueryClient();
    const isFirebaseReady = useFirebaseAuthSync();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!isFirebaseReady) {
                throw new Error("Firebase authentication is not ready");
            }
            return deleteTodo(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", userEmail] });
            toast.success("Task deleted successfully!");
        },
        onError: (error) => {
            console.error("Delete todo error:", error);
            if (error.message === "Firebase authentication is not ready") {
                toast.error("Please wait while we prepare your session...");
            } else {
                toast.error("Failed to delete task.");
            }
        },
    });
}
