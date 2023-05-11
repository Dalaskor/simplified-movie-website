import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class VkLoginDto {
  @ApiProperty({
    example: 'vk1.a.SDKJWELKJSDkdfjlskekJkjsdfjsdkf',
    description: 'Токен доступа VK',
  })
  @IsString({ message: 'Должно быть строкой' })
  access_token: string;

  @ApiProperty({
    example: '86400',
    description: 'Время действия токена',
  })
  @IsNumber({}, { message: 'Должно быть целым числом' })
  expires_in: number;

  @ApiProperty({
    example: '1235092',
    description: 'ID пользователя VK',
  })
  @IsNumber({}, { message: 'Должно быть целым числом' })
  user_id: number;
}
