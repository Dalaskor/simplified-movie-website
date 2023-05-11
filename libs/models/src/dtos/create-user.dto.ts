import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@mail.ru',
    description: 'Электронная почта',
  })
  @IsEmail({ allow_utf8_local_part: false }, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({
    example: 'pass0550',
    description: 'Пароль (длина от 6 до 24 символов)',
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(6, 24, {
    message: 'Длина пароля должна быть не меньше 6 и не больше 24',
  })
  password: string;
}
