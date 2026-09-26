import { userService } from "@/lib/container/user.container";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET() {
    try {
        const users = await userService.getUsers();
        return NextResponse.json(users);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const user = await userService.createUser(body);
        return NextResponse.json(user);
    } catch (error) {
        return handleApiError(error);
    }
}