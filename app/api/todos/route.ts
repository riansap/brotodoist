export const runtime = "edge";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { fetchTodos, addTodo } from "@/lib/services/todo.service";

const postTodoSchema = z.object({
    text: z.string()
        .min(1, { message: "Text cannot be empty" })
        .max(50, { message: "Text cannot exceed 50 characters" }),
});

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;

        if (!email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const todos = await fetchTodos(email);
        return NextResponse.json(todos);
    } catch (error) {
        console.error("GET /api/todos error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;

        if (!email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const validation = postTodoSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation Failed", errors: validation.error.errors },
                { status: 400 }
            );
        }

        const newTodo = await addTodo(validation.data.text, email);
        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        console.error("POST /api/todos error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
