import { projectService } from "@/lib/container/project.container";
import { success, failure, type Params } from "@/lib/api/response";

export async function PATCH(request: Request, { params }: Params) {
    try {
        const { searchParams } = new URL(request.url);
        // temporary until auth middleware
        const uid = searchParams.get("uid");
        if (!uid) {
            throw new Error("User id is required");
        }
        await projectService.deleteAllProjects(uid);
        return success({ status: "reset" }, 200);
    } catch (error) {
        return failure(error, 400);
    }
}