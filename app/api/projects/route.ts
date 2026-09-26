import { projectService } from "@/lib/container/project.container";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET() {
    try {
        const projects = await projectService.getProjects();
        return NextResponse.json({ success: true, data: projects });
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
        const project = await projectService.createProject(uid, body);
        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        handleApiError(error)
    }
}