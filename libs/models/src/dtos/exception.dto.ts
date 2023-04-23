import { ApiProperty } from '@nestjs/swagger';

export class ExceptionDto {
    @ApiProperty({
        description: 'Status code',
    })
    readonly statusCode: number;

    @ApiProperty({
        description: 'Message',
    })
    readonly message: string;

    @ApiProperty({
        description: 'Error',
    })
    readonly error: string;
}
