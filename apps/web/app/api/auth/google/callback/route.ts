import { createSession } from "@/lib/sessions";
import { Role } from "@/lib/type";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { ref } from "process";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userId = searchParams.get("userId");
    const name = searchParams.get("name");
    const role = searchParams.get('role')

    if (!accessToken || !refreshToken || !userId || !name || !role) {
        throw new Error("app/api/auth/google/callback :: Google OAuth Failed!");
    }

    await createSession({
        user: {
            id: userId,
            name: name,
            role: role as Role
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
    })

    redirect("/");
}