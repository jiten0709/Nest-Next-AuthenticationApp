import { refreshToken } from "./auth"
import { getSession } from "./sessions"

export interface FetchOptions extends RequestInit {
    headers?: Record<string, string>
}

export const authFetch = async (
    url: string | URL,
    options: FetchOptions = {}
) => {
    const session = await getSession()

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${session?.accessToken}`,
    }

    let response = await fetch(url, options)

    if (response.status === 401) {
        if (!session?.accessToken)
            throw new Error("authFetch :: access token not found!")

        if (!session?.refreshToken)
            throw new Error("authFetch :: refresh token not found!")

        const newAccessToken = await refreshToken(session.refreshToken)
        if (newAccessToken) {
            options.headers.Authorization = `Bearer ${newAccessToken}`
            response = await fetch(url, options)
        }
    }
    return response
}