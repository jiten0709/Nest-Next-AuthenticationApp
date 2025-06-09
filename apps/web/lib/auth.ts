"use server"

import { redirect } from "next/navigation"
import { BACKEND_URL, FRONTEND_URL } from "./constants"
import {
    FormState,
    SignupFormSchema,
    LoginFormSchema
} from "./type"
import { createSession } from "./sessions"

export async function signUp(
    state: FormState,
    formData: FormData
): Promise<FormState> {
    const validationFields = SignupFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
    })
    if (!validationFields.success) {
        return {
            error: validationFields.error.flatten().fieldErrors
        }
    }

    const response = await fetch(
        `${BACKEND_URL}/auth/signup`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validationFields.data)
        }
    )
    if (response.ok) {
        redirect("/auth/signin")
    } else {
        return {
            message: response.status === 409 ? "auth :: The user already exists!!!" : response.statusText
        }
    }
}

export async function signIn(
    state: FormState,
    formData: FormData
): Promise<FormState> {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    })
    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors
        }
    }

    const response = await fetch(
        `${BACKEND_URL}/auth/signin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedFields.data)
        }
    )
    if (response.ok) {
        const result = await response.json()

        // console.log("result: ", result)

        // TODO: create session for authenticated user

        await createSession({
            user: {
                id: result.id,
                name: result.name,
                role: result.role,
            },
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        })

        redirect('/')
    } else {
        return {
            message: response.status === 401 ? "auth :: Invalid User Credentials" : response.statusText
        }
    }
}

export const refreshToken = async (oldRefreshToken: string) => {
    try {
        const response = await fetch(
            `${BACKEND_URL}/auth/refresh`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh: oldRefreshToken,
                })
            }
        )
        if (!response.ok) {
            const errorText = await response.text();
            console.error("refreshToken :: backend response:", errorText);
            throw new Error(`auth.ts :: Failed to refresh the token :: ${response.statusText}`)
        }

        const { accessToken, refreshToken } = await response.json()
        const updateResponse = await fetch(
            `${FRONTEND_URL}/api/auth/update`,
            {
                method: "POST",
                body: JSON.stringify({
                    accessToken,
                    refreshToken,
                }),
            }
        )
        if (!updateResponse.ok)
            throw new Error(`auth.ts :: Failed to update the tokens :: ${updateResponse.statusText}`)

        return accessToken
    } catch (error) {
        console.log("auth.ts :: failed to update the tokens :: ", error)

        return null
    }
}