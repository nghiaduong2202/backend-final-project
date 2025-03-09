import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ActivePeopleData } from '../interfaces/active-people-data.interface';
import { PeopleService } from 'src/people/people.service';
import { GenerateTokenProvider } from './generate-token.provider';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    /**
     * inject jwt service
     */
    private readonly jwtService: JwtService,
    /**
     * inject config service
     */
    private readonly configService: ConfigService,
    /**
     * inject people service
     */
    private readonly peopleService: PeopleService,
    /**
     * inject generate token provider
     */
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // verify refresh token
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActivePeopleData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
      });

      // get people id from refresh token
      const people = await this.peopleService.getPeopleById(sub);

      // generate new access token
      const payload = { role: people.role };

      const accessToken = await this.generateTokenProvider.generateToken(
        people.id,
        this.configService.get<string>('JWT_SECRET')!,
        this.configService.get<string>('JWT_EXPIRE')!,
        payload,
      );

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
