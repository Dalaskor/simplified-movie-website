import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserGmailOAuth {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Почта пользователя Google',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail()
  email: string;
  @ApiPropertyOptional({
      example: 'Ivan',
      description: 'Имя пользователя (необязательное поле)'
  })
  @IsString({message: '"name" - должно быть строкой'})
  @IsOptional()
  name?: string;
}
