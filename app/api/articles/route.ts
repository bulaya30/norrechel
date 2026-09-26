import { NextResponse } from "next/server";
import { articleService } from "@/lib/container/article.container"

import { handleApiError } from "@/lib/api/handle-api-error";


export async function GET() {
  try {
    const articles = await articleService.getPublishedArticles();

    return NextResponse.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.log(error)
    handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // temporary until we add auth
    const uid = body.uid;

    const article = await articleService.createArticle(uid, body);

    return NextResponse.json(
      {
        success: true,
        data: article,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create article",
      },
      { status: 400 }
    );
  }
}