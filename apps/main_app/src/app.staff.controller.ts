import { ROLES, STAFF_SERVICE } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { CreateStaffDto, StaffPagFilter, UpdateStaffDto } from '@app/models';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppStaffController {
    constructor(@Inject(STAFF_SERVICE) private staffClient: ClientProxy) {}

    @ApiTags('Участники')
    @ApiOperation({ summary: 'Создать участника' })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Post('/staffs')
    @ApiBody({
        type: CreateStaffDto,
        description: 'Создание участника',
    })
    @ApiResponse({
        type: CreateStaffDto,
        status: HttpStatus.CREATED,
    })
    async createStaff(@Body() dto: CreateStaffDto) {
        return this.staffClient
            .send('createStaff', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    /* @ApiTags('Участники')
    @ApiOperation({ summary: 'Получить список всех участников' })
    @Get('/all-staffs')
    @ApiResponse({
        type: CreateStaffDto,
        isArray: true,
        description: 'Получить список всех участников',
        status: HttpStatus.OK,
    })
    async getStaffs() {
        return this.staffClient
            .send('findAllStaff', {})
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    } */

    @ApiTags('Участники')
    @ApiOperation({ summary: 'Получить список участников с пагинацией' })
    @Get('/staffs')
    @ApiResponse({
        type: CreateStaffDto,
        status: HttpStatus.OK,
        isArray: true,
    })
    async getStaffsWithPag(@Query() pageOptionsDto: StaffPagFilter) {
        return this.staffClient
            .send('getStaffsWithPag', pageOptionsDto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Участники')
    @ApiOperation({ summary: 'Получить данные участника по ID' })
    @Get('/staffs/:id')
    @ApiParam({
        name: 'id',
        example: 1,
        required: true,
        description: 'Идентификатор участника в базе данных',
        type: Number,
    })
    @ApiResponse({
        type: CreateStaffDto,
        status: HttpStatus.OK,
    })
    async getOneStaff(@Param('id') id: number) {
        return this.staffClient
            .send('findOneStaff', id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Участники')
    @ApiOperation({ summary: 'Обновить данные участника' })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Put('/staff-update')
    @ApiBody({
        type: UpdateStaffDto,
        description: 'Обновить данные о участнике',
    })
    @ApiResponse({
        type: CreateStaffDto,
        status: HttpStatus.OK,
    })
    async updateStaff(@Body() dto: UpdateStaffDto) {
        return this.staffClient
            .send('updateStaff', dto)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }

    @ApiTags('Участники')
    @ApiOperation({ summary: 'Удалить участника по ID' })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Delete('/staffs/:id')
    @ApiParam({
        name: 'id',
        example: 1,
        required: true,
        description: 'Идентификатор участника в базе данных',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Успешно удалено',
    })
    async deleteStaff(@Param('id') id: number) {
        return this.staffClient
            .send('removeStaff', id)
            .pipe(
                catchError((error) =>
                    throwError(() => new RpcException(error.response)),
                ),
            );
    }
}
