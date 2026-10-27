import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function checkAdminSession() {
  const session = await auth();
  if (!session?.user?.email) {
    return {
      authorized: false as const,
      session: null,
      response: NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 },
      ),
    };
  }
  return {
    authorized: true as const,
    session,
    response: null,
  };
}
