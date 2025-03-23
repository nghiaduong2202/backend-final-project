import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { PeopleService } from 'src/people/people.service';
import { HashProvider } from './providers/hash.provider';
import { ConfigService } from '@nestjs/config';
import { TokenProvider } from './providers/token.provider';
import { ActivePeopleData } from './interfaces/active-people-data.interface';

@Injectable()
export class AuthService {
  constructor(
    /**
     * inject peopleService
     */
    private readonly peopleService: PeopleService,
    /**
     * inject hashProvider
     */
    private readonly hashProvider: HashProvider,
    /**
     * inject configService
     */
    private readonly configService: ConfigService,
    /**
     * inject tokenProvider
     */
    private readonly tokenProvider: TokenProvider,
  ) {}

  public async register(registerDto: RegisterDto) {
    // check password equal retypePassword
    if (registerDto.password !== registerDto.retypePassword) {
      throw new BadRequestException('Password and retype password not match');
    }

    // hash password
    const hashPassowrd = await this.hashProvider.hashPassword(
      registerDto.password,
    );

    // set password
    registerDto.password = hashPassowrd;

    // create a new people

    await this.peopleService.create(registerDto);

    return {
      message: 'Create successful',
    };
  }

  public async login(loginDto: LoginDto) {
    // get people by email
    const people = await this.peopleService.getByEmail(loginDto.email);

    // check password
    const isEqual = await this.hashProvider.comparePassword(
      loginDto.password,
      people.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Wrong email or password');
    }

    // generate access token
    const payload = {
      role: people.role,
    };

    const accessToken = await this.tokenProvider.generate(
      people.id,
      this.configService.get<string>('JWT_SECRET')!,
      this.configService.get<string>('JWT_EXPIRE')!,
      payload,
    );

    // generate refresh token
    const refreshToken = await this.tokenProvider.generate(
      people.id,
      this.configService.get<string>('JWT_SECRET_REFRESH')!,
      this.configService.get<string>('JWT_EXPIRE_REFRESH')!,
    );

    // store access token and refresh token into session cookie
    // implement later, after discuss with team

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    // verify refresh token
    const { sub } = await this.tokenProvider.verify<
      Pick<ActivePeopleData, 'sub'>
    >(
      refreshTokenDto.refreshToken,
      this.configService.get<string>('JWT_SECRET_REFRESH')!,
    );

    // get people id from refresh token
    const people = await this.peopleService.getById(sub);

    // generate new access token
    const payload = { role: people.role };
    const accessToken = await this.tokenProvider.generate(
      sub,
      this.configService.get<string>('JWT_SECRET')!,
      this.configService.get<string>('JWT_EXPIRE')!,
      payload,
    );

    // save access token in session, implement later

    return { accessToken };
  }
}
