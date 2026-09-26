import { categoryService } from "@/lib/container/category.container";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET() {
    try {
        const categories = await categoryService.getCategories();

        return NextResponse.json({
            success: true,
            data: categories
        });
    } catch (error) {
        handleApiError(error)        
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const category = await categoryService.createCategory(body);
        return NextResponse.json({
            success: true,
            data: category
        });
    } catch (error) {
        handleApiError(error)        
    }
}