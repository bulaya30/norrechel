import { notificationService } from "@/lib/container/notification.container";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET() {
    try {
        const notifications = await notificationService.getNotifications();
        return NextResponse.json({ success: true, data: notifications });
    } catch (error) {
        handleApiError(error)
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const uid = body.uid;
        if(!uid) {
            throw new Error("User id is required");
        }
        const notification = await notificationService.createNotification(uid, body);
        return NextResponse.json({ success: true, data: notification });
    } catch (error) {
        handleApiError(error)
    }
}