import { Controller, Get, Param, UseGuards, Patch, Body, Delete, Req, Query, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from './cqrs/queries/get-user.query';
import { UpdateUserCommand } from './cqrs/commands/update-user.command';
import { SearchUsersQuery } from './cqrs/queries/search-users.query';
import { DeleteUserCommand } from './cqrs/commands/delete-user.command';
import { CreateUserCommand } from './cqrs/commands/create-user.command';
import { CheckLoginBotQuery } from './cqrs/queries/check-login-bot.query';
import { CheckLoginQuery } from './cqrs/queries/check-login.query';
import { CheckLoginBotDto, CheckLoginDto, CreateUserDto, GetUserDto, JwtAuthGuard, SearchUsersDto, UpdateUserDto } from 'src/lib';

@Controller('users')
export class UsersController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) { }
    @Post()
    async create(@Body() dto: CreateUserDto) {
        return this.commandBus.execute(
            new CreateUserCommand(dto.username, dto.email, dto.password),
        );
    }
    @Post("check/login")
    @HttpCode(HttpStatus.OK)
    async checkLogin(@Body() dto: CheckLoginDto) {
        return this.queryBus.execute(
            new CheckLoginQuery(dto.usernameOrEmail, dto.password),
        );
    }
    @Post("check/login/bot")
    @HttpCode(HttpStatus.OK)
    async checkLoginBot(@Body() dto: CheckLoginBotDto) {
        return this.queryBus.execute(
            new CheckLoginBotQuery(dto.id, dto.token),
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async patchMe(@Req() req, @Body() dto: UpdateUserDto) {
        return this.commandBus.execute(new UpdateUserCommand(req.user.id, dto));
    }

    @UseGuards(JwtAuthGuard)
    @Delete('me')
    async deleteMe(@Req() req) {
        return this.commandBus.execute(new DeleteUserCommand(req.user.id));
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req) {
        return this.queryBus.execute(new GetUserQuery(req.user.id, true));
    }

    @Get(':id')
    async getPublic(@Param('id') id: string, @Query() query: GetUserDto) {
        return this.queryBus.execute(new GetUserQuery(id, query.full));
    }

    @Get()
    async search(@Query() query: SearchUsersDto) {
        return this.queryBus.execute(new SearchUsersQuery(query.term));
    }
}
