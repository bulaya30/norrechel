import { projectService } from "@/lib/container/project.container";
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

        const project = await projectService.getProjectById(uid, id);
        return success(project);
    } catch (error) {
        return failure(error, 400);
    }
}

export async function PATCH(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();

        // temporary until auth middleware
        const uid = body.uid;

        await projectService.updateProject(uid, id, body);

        return success({ id });
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

        await projectService.deleteProject(uid, id);

        return success({ sucess: true });
    } catch (error) {
        return failure(error, 400);
    }
}