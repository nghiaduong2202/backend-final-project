import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PeopleService } from 'src/people/people.service';
import { HashProvider } from './hash.provider';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dtos/login.dto';
import { People } from 'src/people/people.entity';
import { GenerateTokenProvider } from './generate-token.provider';

@Injectable()
export class LoginProvider {
  constructor(
    /**
     * Inject PeopleService
     */
    private readonly peopleService: PeopleService,
    /**
     * Inject HashProvider
     */
    private readonly hashProvider: HashProvider,
    /**
     * Inject ConfigService
     */
    private readonly configService: ConfigService,
    /**
     * inject generate toke provider
     */
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  public async login(loginDto: LoginDto) {
    let existingUser: People;

    try {
      existingUser = await this.peopleService.getPeopleByEmail(loginDto.email);
    } catch {
      throw new UnauthorizedException('Wrong email or password');
    }

    const isEqual = await this.hashProvider.comparePassword(
      loginDto.password,
      existingUser.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const payload = {
      role: existingUser.role,
    };

    const acceptToken = await this.generateTokenProvider.generateToken(
      existingUser.id,
      this.configService.get<string>('JWT_SECRET')!,
      this.configService.get<string>('JWT_EXPIRE')!,
      payload,
    );

    const refreshToken = await this.generateTokenProvider.generateToken(
      existingUser.id,
      this.configService.get<string>('JWT_SECRET_REFRESH')!,
      this.configService.get<string>('JWT_EXPIRE_REFRESH')!,
    );

    return {
      acceptToken,
      refreshToken,
    };
  }
}
