import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: "email"
        })
    }

    validate(email: string, password: string) {
        if (password === "")
            throw new UnauthorizedException("local.strategy :: Please provide your password!");

        return this.authService.validateLocalUser(email, password)
    }
}