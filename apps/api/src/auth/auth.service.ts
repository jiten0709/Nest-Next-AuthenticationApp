import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async registerUser(createUserDto: CreateUserDto) {
        const user = await this.userService.findByEmail(createUserDto.email)
        if (user) throw new ConflictException('User already exists!')

        return this.userService.create(createUserDto)
    }

    async validateLocalUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email)
        if (!user) throw new ConflictException('User not found!')

        const isPasswordMatched = verify(user.password, password)
        if (!isPasswordMatched) throw new UnauthorizedException('Invalid Credentials!')

        return { id: user.id, name: user.name, role: user.role }
    }

    async login(userId: number, name?: string) {
        const { access_token } = await this.generateTokens(userId)

        return {
            id: userId,
            name: name,
            access_token: access_token
        }
    }

    async generateTokens(userId: number) {
        const payload: AuthJwtPayload = { sub: userId }
        const [access_token] = await Promise.all([
            this.jwtService.signAsync(payload)
        ])

        return {
            access_token
        }
    }

    async validateJwtUser(userId: number) {
        const user = await this.userService.findOne(userId)
        if (!user) throw new UnauthorizedException("User not found!")

        const currentUser = { id: user.id, name: user.name }

        return currentUser
    }
}
