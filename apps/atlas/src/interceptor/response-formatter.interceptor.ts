import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { ResponseFormatterService } from 'src/services/response-formatter.service';
import { RESPONSE_FORMATTER_FIELDS } from 'src/decorators/response-formatter.decorator';

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  constructor(
    private readonly formatter: ResponseFormatterService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Retrieves the list of fields to remove from the decorator
    const removeKeys: string[] = this.reflector.get<string[]>(
      RESPONSE_FORMATTER_FIELDS,
      context.getHandler(),
    ) ?? ['password', 'secret', 'token']; // default value
    return next.handle().pipe(map(data => this.formatter.format(data, removeKeys)));
  }
}
