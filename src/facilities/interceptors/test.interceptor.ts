import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class TestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = context.switchToHttp().getRequest<Request>().body;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    body.testDto = JSON.stringify(body.testDto);

    console.log('🚀 ~ TestInterceptor ~ intercept ~ request:', body);
    return next.handle();
  }
}
