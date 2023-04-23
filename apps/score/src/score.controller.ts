import { CreateScoreDto, DeleteScoreDto } from '@app/models';
import { UpdateScoreDto } from '@app/models/dtos/update-score.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ScoreService } from './score.service';

@Controller()
export class ScoreController {
    constructor(private readonly scoreService: ScoreService) {}

    @MessagePattern('createScore')
    async create(@Payload() dto: CreateScoreDto) {
        return await this.scoreService.create(dto);
    }

    @MessagePattern('updateScore')
    async update(@Payload() dto: UpdateScoreDto) {
        return await this.scoreService.update(dto);
    }

    @MessagePattern('deleteScore')
    async delete(@Payload() dto: DeleteScoreDto) {
        return await this.scoreService.delete(dto);
    }
}
