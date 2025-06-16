"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAddTodo } from "@/lib/hooks/useAddTodo";

export default function AddTodoForm() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const [text, setText] = useState("");

  const { mutate, isPending } = useAddTodo(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return toast.warning("Text cannot be empty.");
    if (!email) return toast.error("You must be signed in.");
    mutate(text.trim(), {
      onSuccess: () => setText(""),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 w-full"
    >
      <div className="flex-1">
        <Input
          className="w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!email || isPending}
          placeholder="Add a new task ..."
          aria-label="Task Input"
        />
      </div>
      <div>
        <Button
          type="submit"
          disabled={!text.trim() || isPending}
          aria-disabled={!text.trim() || isPending}
          aria-label="Add Task Button"
          className="w-full sm:w-auto"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </span>
          ) : (
            "Add Task"
          )}
        </Button>
      </div>
    </form>
  );
}
