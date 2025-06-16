import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth/options";
import { updateTodo, deleteTodo } from "@/lib/services/todo.service";

// validasi body request
const putTodoSchema = z.object({
    completed: z.boolean(),
}).strict();

// PUT /api/todos/[id]
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = request.nextUrl.pathname.split("/").pop(); // ambil ID dari URL
        const body = await request.json();
        const validation = putTodoSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: "Invalid input", errors: validation.error.errors }, { status: 400 });
        }

        if (!id) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        await updateTodo(id, validation.data.completed);
        return NextResponse.json({ message: "Todo updated successfully" });
    } catch (error) {
        console.error("PUT /api/todos/[id] Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE /api/todos/[id]
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const id = request.nextUrl.pathname.split("/").pop();
        if (!id) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        await deleteTodo(id);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("DELETE /api/todos/[id] Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
