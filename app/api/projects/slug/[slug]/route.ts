import { projectService } from "@/lib/container/project.container";
import { success, failure } from "@/lib/api/response";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: Params) {
    try {
        const { slug } = await params;
        const project = await projectService.getProjectBySlug(slug);
        if(!project) {
            return failure(new Error("Project not found"), 404);
        }
        return success(project);
    } catch (error) {
        return failure(error, 400);
    }
}