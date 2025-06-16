"use client";

import LoginButton from "@/components/LoginButton";
import AddTodoForm from "@/components/AddTodoForm";
import TodoList from "@/components/TodoList";
import Image from "next/image";
import { Toaster } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <h1 className="text-2xl font-bold">Brotodoist</h1>
        </div>
        <div className="flex items-center ">
          <LoginButton />
          <ThemeToggle />
        </div>
      </div>

      <p className="text-lg font-semibold mb-4">What needs to be done, Bro?</p>

      <AddTodoForm />
      <TodoList />
      <Toaster richColors position="top-center" />
    </main>
  );
}
