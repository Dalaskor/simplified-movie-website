import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GenreController } from './genre.controller';
import { Genre } from './genre.model';
import { GenreService } from './genre.service';

@Module({
    imports: [DatabaseModule, SequelizeModule.forFeature([Genre])],
    controllers: [GenreController],
    providers: [GenreService],
})
export class GenreModule {}
