
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchUsersQuery } from '../search-users.query';
import { PrismaService } from 'src/services/prisma.service';

@QueryHandler(SearchUsersQuery)
export class SearchUsersHandler implements IQueryHandler<SearchUsersQuery> {
  constructor(private prisma: PrismaService) {}

  async execute(query: SearchUsersQuery) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query.term, mode: 'insensitive' } },
          { email: { contains: query.term, mode: 'insensitive' } },
        ],
      },
    });
  }
}
