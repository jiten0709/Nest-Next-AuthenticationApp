import { registerAs } from "@nestjs/config";

export default registerAs("google-oauth", () => ({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURI: process.env.GOOGLE_REDIRECT_URI,
}))