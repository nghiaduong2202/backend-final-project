import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class CreateFacilityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (request.body.data) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        request.body = { ...request.body, ...JSON.parse(request.body.data) };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        delete request.body.data;
      } catch (error) {
        throw new BadRequestException('Invalid data', {
          description: String(error),
        });
      }
    }

    return next.handle();
  }
}
