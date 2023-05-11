import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSpectatorDto {
  @ApiProperty({
    example: '10млн.',
    description: 'Количетсво просмотров',
  })
  @IsString({ message: 'Должно быть строкой' })
  count: string;

  @ApiProperty({
    example: 'Россия',
    description: 'Страна',
  })
  @IsString({ message: 'Должно быть строкой' })
  country: string;
}
