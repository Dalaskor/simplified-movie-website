import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from './users/users.model';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService,
    ) {}

    async createSuperUser(dto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(dto.email);

        if (candidate) {
            throw new HttpException(
                'Пользователь с такой электронной почтой уже существует',
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userService.createAdmin({
            email: dto.email,
            password: hashPassword,
        });

        return await this.generateToken(user);
    }

    async login(dto: CreateUserDto) {
        const user = await this.validateUser(dto);
        return await this.generateToken(user);
    }

    async registration(dto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(dto.email);

        if (candidate) {
            throw new HttpException(
                'Пользователь с такой электронной почтой уже существует',
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userService.createUser({
            email: dto.email,
            password: hashPassword,
        });

        return await this.generateToken(user);
    }

    private async validateUser(dto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(dto.email);
        const passwordEquals = await bcrypt.compare(
            dto.password,
            user.password,
        );

        if (user && passwordEquals) {
            return user;
        }

        throw new UnauthorizedException({
            message: 'Неккоректные электронная почта или пароль',
        });
    }

    private async generateToken(user: User) {
        const payload = {
            id: user.id,
            email: user.email,
            roles: user.roles,
        };

        return {
            token: this.jwtService.sign(payload),
        };
    }

    async handleValidateUser(data: any) {
        return this.jwtService.verify(data.token);
    }

    async handleValidateUserWithRoles(data: any) {
        const checkToken = this.jwtService.verify(data.token);

        const checkRoles = checkToken.roles.some((role: any) =>
            data.requiredRoles.includes(role.value),
        );

        if (checkToken && checkRoles) {
            return checkToken;
        }

        throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }

    async getUser(id: number) {
        const user = await this.userService.getUser(id);

        if (!user) {
            throw new HttpException(
                'Пользователь не найден',
                HttpStatus.NOT_FOUND,
            );
        }

        return user;
    }

    async googleLogin(user: any) {
        if (!user) {
            return 'No user from Google';
        }

        const userEmail = user.email;
        const candidate = await this.userService.getUserByEmail(userEmail);

        if (candidate) {
            return this.generateToken(candidate);
        }

        const password = this.gen_password(15);

        return await this.registration({ email: userEmail, password });
    }

    gen_password(len: number) {
        let password = '';
        const symbols =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!№;%:?*()_+=';

        for (var i = 0; i < len; i++) {
            password += symbols.charAt(
                Math.floor(Math.random() * symbols.length),
            );
        }

        return password;
    }

    async vkLogin(query: any) {
        if (query.access_token && query.user_id) {
            const checkToken = await this.validateVkToken(query.access_token);

            if (checkToken === false) {
                throw new HttpException(
                    'Токен не валидный',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const password = this.gen_password(15);
            const userDto: CreateUserDto = {
                email: `${query.user_id}@vk.com`,
                password,
            };

            const candidate = await this.userService.getUserByEmail(
                userDto.email,
            );

            if (candidate) {
                console.log('GENERATE TOKEN');
                return await this.generateToken(candidate);
            }

            return await this.registration(userDto);
        }

        throw new HttpException(
            'Пользователь не авторизован',
            HttpStatus.UNAUTHORIZED,
        );
    }

    async validateVkToken(token: string) {
        const url = `https://api.vk.com/method/users.get?access_token=${token}&v=5.131`;
        const req = await lastValueFrom(this.httpService.get(url));
        const tokenData = req.data.response[0];
        console.log(tokenData.id);

        if (tokenData.id) {
            return true;
        }

        return false;
    }
}
