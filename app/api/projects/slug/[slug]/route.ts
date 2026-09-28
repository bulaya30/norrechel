import { projectService } from "@/lib/container/project.container";
import { success, failure } from "@/lib/api/response";

import { getAuthenticatedUser } from "@/features/auth/lib/getAuthenticatedUser";

type SupportedLocale = "en" | "fr";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: Params) {
    try {
        const { slug } = await params;
        
        const user = await getAuthenticatedUser();
    
        const url = new URL(request.url);
    
        const localeParam = url.searchParams.get("locale");
    
        const locale: SupportedLocale =
          localeParam === "fr" ? "fr" : "en";
    
        const userId = user?.userId ?? null;
        
        const project = await projectService.getProjectBySlug(
            slug,
            locale,
            userId,
        );
        if(!project) {
            return failure(new Error("Project not found"), 404);
        }
        return success(project);
    } catch (error) {
        return failure(error, 400);
    }
}