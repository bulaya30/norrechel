import { notificationService } from "@/lib/container/notification.container";
import { success, failure, type Params } from "@/lib/api/response";

export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);

        // temporary until auth middleware
        const uid = searchParams.get("uid");

        if (!uid) {
        throw new Error("User id is required");
        }
        const notification = await notificationService.getNotificationById(uid, id);
        return success(notification);
    } catch (error) {
        return failure(error, 400);
    }
}

export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;
         const { searchParams } = new URL(request.url);

        // temporary until auth middleware
        const uid = searchParams.get("uid");

        if (!uid) {
        throw new Error("User id is required");
        }
        await notificationService.deleteNotification(uid, id);
        return success({ id });
    } catch (error) {
        return failure(error, 400);
    }
}