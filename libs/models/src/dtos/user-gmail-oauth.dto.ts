import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserGmailOAuth {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Почта пользователя Google',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail()
  email: string;
}
