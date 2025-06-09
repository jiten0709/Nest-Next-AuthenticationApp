import { createSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { ref } from "process";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userId = searchParams.get("userId");
    const name = searchParams.get("name");

    if (!accessToken || !refreshToken || !userId || !name) {
        throw new Error("app/api/auth/google/callback :: Google OAuth Failed!");
    }

    await createSession({
        user: {
            id: userId,
            name: name,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
    })

    redirect("/");
}