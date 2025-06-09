// import { Inject, Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy, VerifyCallback } from "passport-google-oauth20";
// import googleOauthConfig from "../config/google-oauth.config";
// import { ConfigType } from "@nestjs/config";
// import { AuthService } from "../auth.service";

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//     constructor(
//         @Inject(googleOauthConfig.KEY)
//         private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
//         private readonly authService: AuthService,
//     ) {
//         if (!googleConfig.clientId || !googleConfig.clientSecret || !googleConfig.callbackURI)
//             throw new Error("google.strategy :: Google OAuth credentials are not defined");

//         super({
//             clientID: googleConfig.clientId,
//             clientSecret: googleConfig.clientSecret,
//             callbackURL: googleConfig.callbackURI,
//             scope: ['email', 'profile']
//         })
//     }

//     async validate(
//         accessToken: string,
//         refreshToken: string,
//         profile: any,
//         done: VerifyCallback,
//     ) {
//         const user = await this.authService.validateGoogleUser({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             password: '',
//         })

//         done(null, user)
//     }
// }

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigType } from '@nestjs/config';
import googleOauthConfig from '../config/google-oauth.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
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
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {
        const { name, emails } = profile;

        const user = await this.authService.validateGoogleUser({
            email: emails[0].value,
            name: `${name.givenName}`,
            password: '',
        });

        done(null, user);
    }
}