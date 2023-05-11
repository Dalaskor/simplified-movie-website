import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class RefreshTokensDto {
  @ApiProperty({
    example: '1',
    description: 'ID пользователя, которому требуется обновить токены',
  })
  @IsInt({ message: 'user_id: должно быть целым числом' })
  user_id: number;

  @ApiProperty({
    example: 'alkjSedscjgklxcesdf',
    description: 'JWT токен для обновления токенов',
  })
  @IsString({ message: 'refreshToken: должно быть строкой' })
  refreshToken: string;
}
