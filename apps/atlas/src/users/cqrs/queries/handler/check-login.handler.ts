import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import { CheckLoginQuery } from '../check-login.query';
import { PrismaService } from 'src/services/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

@QueryHandler(CheckLoginQuery)
export class CheckLoginHandler implements IQueryHandler<CheckLoginQuery> {
    constructor(private usersRepo: PrismaService) { }

    async execute(query: CheckLoginQuery) {
        const { usernameOrEmail, password } = query;
        const repository = await this.usersRepo.user

        const user = await repository.findFirst({
            where: {
                OR: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail },
                ],
            },
        });

        if (!user || !(bcrypt.compare(password, user.password))) throw new UnauthorizedException('Invalid user credentials.');
        return user;
    }
}
