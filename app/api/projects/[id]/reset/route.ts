import { projectService } from "@/lib/container/project.container";
import { success, failure, type Params } from "@/lib/api/response";

export async function PATCH(request: Request, { params }: Params) {
    try {
        const body = await request.json();
        const uid = body.uid;
        if (!uid) {
            throw new Error("User id is required");
        }
        await projectService.deleteAllProjectsForUser(uid);
        return success({ status: "reset" }, 200);
    } catch (error) {
        return failure(error, 400);
    }
}