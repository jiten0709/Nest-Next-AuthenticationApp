import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
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
        const { accessToken, refreshToken } = await this.generateTokens(userId)

        return {
            id: userId,
            name: name,
            access_token: accessToken,
            refresh_token: refreshToken,
        }
    }

    async generateTokens(userId: number) {
        const payload: AuthJwtPayload = { sub: userId }
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig)
        ])

        return {
            accessToken,
            refreshToken,
        }
    }

    async validateJwtUser(userId: number) {
        const user = await this.userService.findOne(userId)
        if (!user) throw new UnauthorizedException("auth.service :: User not found!")

        const currentUser = { id: user.id, name: user.name }

        return currentUser
    }

    async validateRefreshToken(userId: number, refreshToken: string) {
        const user = await this.userService.findOne(userId)
        if (!user)
            throw new UnauthorizedException("auth.service :: user not found!")

        if (!user.hashedRefreshToken)
            throw new UnauthorizedException("auth.service :: No refresh token found!")

        const refreshTokenMactched = await verify(user.hashedRefreshToken, refreshToken)
        if (!refreshTokenMactched)
            throw new UnauthorizedException("auth.service :: Invalid refresh token!")

        const currentUser = { id: user.id }

        return currentUser
    }

    async refreshToken(userId: number, name: string) {
        const { accessToken, refreshToken } = await this.generateTokens(userId)
        const hasedRT = await hash(refreshToken)
        await this.userService.updateHashedRefreshToken(userId, hasedRT)

        return {
            id: userId,
            name: name,
            accessToken,
            refreshToken,
        }
    }
}
