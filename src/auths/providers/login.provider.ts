import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PeopleService } from 'src/people/providers/people.service';
import { HashProvider } from './hash.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dtos/login.dto';
import { People } from 'src/people/people.entity';

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
     * Inject JwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject ConfigService
     */
    private readonly configService: ConfigService,
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
      sub: existingUser.id,
      role: existingUser.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return {
      token,
      user: existingUser,
    };
  }
}
