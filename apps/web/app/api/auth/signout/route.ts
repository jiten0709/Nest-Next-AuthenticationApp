import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { deleteSession } from "@/lib/sessions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const response = await authFetch(`${BACKEND_URL}/auth/signout`, {
        method: "POST",
    })
    if (response.ok) { await deleteSession() }

    revalidatePath("/");

    return NextResponse.redirect(new URL("/", req.nextUrl))
}