"use client";

import LoginButton from "@/components/LoginButton";
import AddTodoForm from "@/components/AddTodoForm";
import TodoList from "@/components/TodoList";
import Image from "next/image";
import { Toaster } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="px-4 py-6 max-w-screen-md mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        {/* Logo + Title */}
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

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-4 ml-auto sm:ml-0">
          <LoginButton />
          <ThemeToggle />
        </div>
      </div>

      {/* Hero Text */}
      <p className="text-lg font-semibold mb-4">What needs to be done, Bro?</p>

      {/* Form & List */}
      <AddTodoForm />
      <TodoList />

      {/* Toast Notifications */}
      <Toaster richColors position="top-center" />
    </main>
  );
}
