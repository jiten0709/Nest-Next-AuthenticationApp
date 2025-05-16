import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import googleOauthConfig from "../config/google-oauth.config";
import { ConfigType } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(googleOauthConfig.KEY)
        private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
        private readonly authService: AuthService,
    ) {
        if (!googleConfig.clientId || !googleConfig.clientSecret || !googleConfig.callbackURI)
            throw new Error("google.strategy :: Google OAuth credentials are not defined");

        super({
            clientID: googleConfig.clientId,
            clientSecret: googleConfig.clientSecret,
            callbackURL: googleConfig.callbackURI,
            scope: ['email', 'profile']
        })
    }

    async validate(
        profile: any,
        done: VerifyCallback,
    ) {
        const user = this.authService.validateGoogleUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: '',
        })

        done(null, user)
    }
}