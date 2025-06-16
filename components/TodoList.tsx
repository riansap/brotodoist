"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Loader2 } from "lucide-react";
import { useTodos } from "@/lib/hooks/useTodos";
import { useUpdateTodo } from "@/lib/hooks/useUpdateTodo";
import { useDeleteTodo } from "@/lib/hooks/useDeleteTodo";

export default function TodoList() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: todos, isLoading } = useTodos(email);
  const updateMutation = useUpdateTodo(email);
  const deleteMutation = useDeleteTodo(email);

  if (!session) {
    return (
      <p className="text-center text-gray-500 mt-8">
        Please sign in to manage your tasks.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <p className="text-gray-500 mt-2">Loading your tasks...</p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        You have no tasks yet. Add one!
      </p>
    );
  }

  return (
    <div className="mt-4">
      <ul>
        {todos.map((todo) => {
          const isUpdating = updatingId === todo.id;
          const isDeleting = deletingId === todo.id;

          return (
            <li
              key={todo.id}
              className="p-4 border-b flex items-center gap-4 transition-opacity"
              style={{ opacity: isDeleting ? 0.6 : 1 }}
            >
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={(checked) => {
                  if (!isDeleting && !isUpdating) {
                    setUpdatingId(todo.id);
                    updateMutation.mutate(
                      { id: todo.id, completed: checked === true },
                      {
                        onSettled: () => setUpdatingId(null),
                      }
                    );
                  }
                }}
                disabled={isUpdating || isDeleting}
              />

              <label
                htmlFor={`todo-${todo.id}`}
                className={`flex-grow cursor-pointer ${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.text}
              </label>

              {isUpdating ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeletingId(todo.id);
                    deleteMutation.mutate(todo.id, {
                      onSettled: () => setDeletingId(null),
                    });
                  }}
                  size="sm"
                  disabled={isDeleting || isUpdating}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span className="text-white">Deleting...</span>
                    </>
                  ) : (
                    <span className="text-white">Delete</span>
                  )}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
