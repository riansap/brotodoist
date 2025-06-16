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
        Please sign in to manage your tasks, Bro!
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <p className="text-gray-500 mt-2">Loading your tasks ...</p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        Its still empty, lets create one, Bro!
      </p>
    );
  }

  return (
    <div className="mt-4">
      <ul className="space-y-4">
        {todos.map((todo) => {
          const isUpdating = updatingId === todo.id;
          const isDeleting = deletingId === todo.id;

          return (
            <li
              key={todo.id}
              className={`border p-4 rounded-md transition-opacity ${
                isDeleting ? "opacity-60" : ""
              } flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4`}
            >
              {/* Left: Checkbox + Text */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
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
                  className={`text-sm leading-relaxed break-words whitespace-normal flex-1 min-w-0 ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.text}
                </label>
              </div>

              {/* Right: Delete Button or Updating */}
              <div className="flex sm:justify-end items-center sm:items-start gap-2 sm:w-1/5 w-full">
                {isUpdating ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeletingId(todo.id);
                      deleteMutation.mutate(todo.id, {
                        onSettled: () => setDeletingId(null),
                      });
                    }}
                    disabled={isDeleting || isUpdating}
                    className="w-full sm:w-auto"
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
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
