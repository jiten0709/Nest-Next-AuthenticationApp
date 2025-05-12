import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import refreshConfig from './config/refresh.config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @Inject(refreshConfig.KEY)
        private readonly refreshTokenConfig: ConfigType<typeof refreshConfig>
    ) { }

    async registerUser(createUserDto: CreateUserDto) {
        const user = await this.userService.findByEmail(createUserDto.email)
        if (user) throw new ConflictException('auth.service :: User already exists!')

        return this.userService.create(createUserDto)
    }

    async validateLocalUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email)
        if (!user) throw new ConflictException('auth.service :: User not found!')

        const isPasswordMatched = verify(user.password, password)
        if (!isPasswordMatched) throw new UnauthorizedException('auth.service :: Invalid Credentials!')

        return { id: user.id, name: user.name, role: user.role }
    }

    async login(userId: number, name?: string) {
        const { access_token, refresh_token } = await this.generateTokens(userId)

        return {
            id: userId,
            name: name,
            access_token: access_token,
            refresh_token: refresh_token,
        }
    }

    async generateTokens(userId: number) {
        const payload: AuthJwtPayload = { sub: userId }
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig)
        ])

        return {
            access_token,
            refresh_token,
        }
    }

    async validateJwtUser(userId: number) {
        const user = await this.userService.findOne(userId)
        if (!user) throw new UnauthorizedException("auth.service :: User not found!")

        const currentUser = { id: user.id, name: user.name }

        return currentUser
    }
}
