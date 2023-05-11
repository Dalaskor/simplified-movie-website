import { ApiProperty } from '@nestjs/swagger';

export class OutputJwtTokens {
  @ApiProperty({
    example: 'aksjwelWe4kjldfksjas',
    description: 'JWT токен',
  })
  token: string;

  @ApiProperty({
    example: 'aksjwelWe4kjldfksjas',
    description: 'JWT refresh токен',
  })
  refreshToken: string;
}
