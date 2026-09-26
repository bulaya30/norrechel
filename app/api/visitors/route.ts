import { visitorService } from "@/lib/container/visitor.container";
import { success, failure } from "@/lib/api/response";

export async function GET() {
    try {
        const visitors = await visitorService.getVisitors();
        return success(visitors);
    } catch (error) {
        return failure(error);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const req = await request.json();
        const visitor = await visitorService.trackVisitor(req, body);
        return success(visitor);
    } catch (error) {
        return failure(error);
    }
}