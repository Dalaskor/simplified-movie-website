import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleResponseDto {
    @ApiProperty({
        example: 'SDKJWELKJSDkdfjlskekJkjsdfjsdkf',
        description: 'Токен доступа Google',
    })
    @IsString({ message: 'Должно быть строкой' })
    token: string;
}
