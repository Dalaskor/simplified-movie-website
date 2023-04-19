import { IsNumber } from 'class-validator';

export class CreateStaffDto {
    @IsNumber({}, { message: 'Должно быть целым числом' })
    name: string;
}