import { IsNumber, IsString } from 'class-validator';

export class VkLoginDto {
    @IsString({ message: 'Должно быть строкой' })
    access_token: string;

    @IsNumber({}, { message: 'Должно быть целым числом' })
    expires_in: number;

    @IsNumber({}, { message: 'Должно быть целым числом' })
    user_id: number;
}
