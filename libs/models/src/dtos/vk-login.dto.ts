import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class VkLoginDto {
  @ApiProperty({
    example: 'vk1.a.SDKJWELKJSDkdfjlskekJkjsdfjsdkf',
    description: 'Токен доступа VK',
  })
  @IsString({ message: '"access_token" - Должно быть строкой' })
  access_token: string;

  @ApiProperty({
    example: '86400',
    description: 'Время действия токена',
  })
  @IsNumber({}, { message: '"expires_in" - Должно быть целым числом' })
  expires_in: number;

  @ApiProperty({
    example: '1235092',
    description: 'ID пользователя VK',
  })
  @IsNumber({}, { message: '"user_id" - должно быть целым числом' })
  user_id: number;

  @ApiPropertyOptional({
      example: 'Ivan',
      description: 'Имя пользователя (необязательное поле)'
  })
  @IsString({message: '"name" - должно быть строкой'})
  @IsOptional()
  name?: string;
}
