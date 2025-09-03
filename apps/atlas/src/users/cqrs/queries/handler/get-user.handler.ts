import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/services/prisma.service';
import { RedisService } from 'src/services/redis.service';
import { GetUserQuery } from '../get-user.query';
import { SnowflakeService } from 'src/services/snowflake.service';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    private CACHE_TTL = 300;
    constructor(private prisma: PrismaService, private snowflake: SnowflakeService, private redis: RedisService) { }

    async execute(query: GetUserQuery) {
        let { id, full } = query;
        const key = `user:${id}`; // Todo mettre la bonne cle et le bon ttl
        let user, cached;

        if (!full) cached = await this.redis.get(key);

        if (cached) user = JSON.parse(cached);
        else {
            let _id = this.snowflake.toBigInt(id);
            const select = full
                ? { id: true, username: true, email: true, isBot: true }
                : { id: true, username: true };
                
            user = await this.prisma.user.findUnique({ where: { id: _id }, select });
            if (!full && user) {
                cached = { ...user, id: this.snowflake.toString(user.id) };
                cached = JSON.stringify(cached);
            } // cached is already null
        }
        // Refresh cache with old data of user or new data of user
        if (cached) await this.redis.set(key, cached, this.CACHE_TTL);
        return user;
    }
}
