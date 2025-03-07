import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ActivePeopleData } from '../interfaces/active-people-data.interface';
import { AuthRoleEnum } from '../enums/auth-role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    /**
     * Inject JwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject ConfigService
     */
    private readonly configService: ConfigService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractRequestFromHeader(request);

    if (!token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync<ActivePeopleData>(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      if (payload.role !== String(AuthRoleEnum.ADMIN)) {
        return false;
      }

      request['people'] = payload;
    } catch {
      return false;
    }
    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [, token] = request.headers.authorization?.split(' ') || [];

    return token;
  }
}
