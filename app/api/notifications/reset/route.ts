import { notificationService } from "@/lib/container/notification.container";
import { success, failure } from "@/lib/api/response";

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // temporary until auth middleware
        const uid = searchParams.get("uid");

        if (!uid) {
        throw new Error("User id is required");
        }
        await notificationService.resetAllNotifications(uid);
        return success({ reset: true });
    } catch (error) {
        return failure(error, 400);
    }
}