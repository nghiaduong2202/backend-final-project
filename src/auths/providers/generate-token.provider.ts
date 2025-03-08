import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    /**
     * Inject JwtService
     */
    private readonly jwtService: JwtService,
  ) {}

  public async generateToken<T>(
    peopleId: UUID,
    secret: string,
    expiresIn: string,
    playload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: peopleId,
        ...playload,
      },
      {
        secret,
        expiresIn,
      },
    );
  }
}
