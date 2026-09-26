import { NextResponse } from "next/server";

export type Params = {
  params: Promise<{ id: string }>;
};

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function failure(error: unknown, status = 500) {
  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    },
    { status }
  );
}