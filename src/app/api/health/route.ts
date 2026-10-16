import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "mahalaxmi-enterprises-cms",
    timestamp: new Date().toISOString(),
  });
}
