import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokenResponseDto {
    @ApiProperty({
        example: 'ASdfaasdgweroidkljaflsdkfSDfjglksdf',
        description: 'JWT Token',
    })
    @IsString()
    readonly token: string;
}
