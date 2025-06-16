import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../services/todo.service";
import { Todo } from "@/types/todo";
import { useFirebaseAuthSync } from "./useFirebaseAuthSync";

/**
 * Hook to fetch todos from the server.
 * @param userEmail The user's email address.
 * @returns The todos.
 */
export function useTodos(userEmail: string | null | undefined) {
    const isFirebaseReady = useFirebaseAuthSync();

    return useQuery<Todo[]>({
        queryKey: ["todos", userEmail],
        queryFn: async () => {
            if (!userEmail) {
                throw new Error("User email is required");
            }

            if (!isFirebaseReady) {
                throw new Error("Firebase authentication is not ready");
            }

            return fetchTodos(userEmail);
        },
        enabled: !!userEmail && isFirebaseReady,
        retry: (failureCount, error: Error) => {
            if (
                error?.message === "Firebase authentication is not ready" ||
                error?.message === "User email is required"
            ) {
                return false;
            }
            return failureCount < 3;
        },
        staleTime: 1000 * 10, // data dianggap fresh selama 10 detik
        refetchOnWindowFocus: false,
    });
}
