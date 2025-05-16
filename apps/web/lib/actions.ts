"use server"

import { BACKEND_URL } from "./constants"
import { authFetch } from "./authFetch"

export const getProfile = async () => {
    // const session = await getSession()
    // const response = await fetch(`${BACKEND_URL}/auth/protected`, {
    //     headers: {
    //         authorization: `Bearer ${session?.accessToken}`
    //     }
    // })
    // return await response.json()

    const response = await authFetch(`${BACKEND_URL}/auth/protected`)
    return await response.json()
}