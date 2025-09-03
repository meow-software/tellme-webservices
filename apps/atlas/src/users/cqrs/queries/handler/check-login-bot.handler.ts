import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckLoginBotQuery } from '../check-login-bot.query';
import { PrismaService } from 'src/services/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { SnowflakeService } from 'src/services/snowflake.service';

@QueryHandler(CheckLoginBotQuery)
export class CheckLoginBotHandler implements IQueryHandler<CheckLoginBotQuery> {
    constructor(private botsRepo: PrismaService, private snowflake: SnowflakeService) { }

    async execute(query: CheckLoginBotQuery) {
        const { id, token } = query;
        const repository = await this.botsRepo.bot

        const bot = await repository.findFirst({
            where: { id: this.snowflake.toBigInt(id), token: token },
            include: { user: true }
        });

        if (!bot) throw new UnauthorizedException('Invalid bot credentials.');
        return bot;
    }
}
