import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'Должно быть строкой' })
    @IsEmail({}, { message: 'Некорректный email' })
    readonly email: string;

    @IsString({ message: 'Должно быть строкой' })
    @Length(6, 24, {
        message: 'Длина пароля должна быть не меньше 6 и не больше 24',
    })
    readonly password: string;
}
