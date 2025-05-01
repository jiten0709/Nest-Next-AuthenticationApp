"use server"

import { getSession } from "./sessions"
import { BACKEND_URL } from "./constants"

export const getProfile = async () => {
    const session = await getSession()
    const response = await fetch(`${BACKEND_URL}/auth/protected`, {
        headers: {
            authorization: `Bearer ${session?.accessToken}`
        }
    })

    return await response.json()
}