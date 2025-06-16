import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "../services/todo.service";
import { toast } from "sonner";
import { useFirebaseAuthSync } from "./useFirebaseAuthSync";

/**
 * Custom hook to update a todo item's completion status.
 *
 * This hook uses a mutation to update the 'completed' status of a todo
 * in the database. On a successful update, it invalidates the "todos" 
 * query cache for the specified user email, prompting a refetch of todos.
 * Displays a success toast on success and an error toast on failure.
 *
 * @param userEmail - The email of the user whose todos are being managed.
 *                    If null or undefined, the hook will not attempt to refetch todos.
 * @returns A mutation object for updating a todo.
 */

export function useUpdateTodo(userEmail: string | null | undefined) {
    const queryClient = useQueryClient();
    const isFirebaseReady = useFirebaseAuthSync();

    return useMutation({
        mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
            if (!isFirebaseReady) {
                throw new Error("Firebase authentication is not ready");
            }
            return updateTodo(id, completed);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos", userEmail] });
            toast.success("Todo updated!");
        },
        onError: (error) => {
            console.error("Update todo error:", error);
            if (error.message === "Firebase authentication is not ready") {
                toast.error("Please wait while we prepare your session...");
            } else {
                toast.error("Failed to update todo");
            }
        },
    });
}
