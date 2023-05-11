import { FILM_SERVICE } from '@app/common';
import { CreateFilmDto } from '@app/models';
import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppFillDbController {
  constructor(@Inject(FILM_SERVICE) private filmClient: ClientProxy) {}

  @ApiTags('Заполнение базы данных')
  @ApiOperation({ summary: 'Заполнение базы данных из файла JSON' })
  @Post('/fill-db')
  @ApiBody({ type: [CreateFilmDto] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'База данных заполнена успешно',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Произошла ошибка при заполнении',
  })
  async fillDb(@Body() dtoArray: CreateFilmDto[]) {
    return this.filmClient
      .send('createManyFilm', dtoArray)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
