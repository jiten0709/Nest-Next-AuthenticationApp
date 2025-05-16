import { updateTokens } from "@/lib/sessions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { accessToken, refreshToken } = body
    if (!accessToken || !refreshToken)
        return new Response("auth/update/route :: Provide Tokens", { status: 401 })

    await updateTokens({ accessToken, refreshToken })

    return new Response("auth/update/route :: OK", { status: 200 })
}