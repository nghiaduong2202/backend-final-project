import { Injectable } from '@nestjs/common';
import { RegisterProvider } from './providers/register.provider';
import { RegisterDto } from './dtos/register.dto';
import { LoginProvider } from './providers/login.provider';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshTokenProvider } from './providers/refresh-token.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject RegisterProvider
     */
    private readonly registerProvider: RegisterProvider,
    /**
     * Inject LoginProvider
     */
    private readonly loginProvider: LoginProvider,
    /**
     * inject refresh token provider
     */
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  public async register(registerDto: RegisterDto) {
    return await this.registerProvider.register(registerDto);
  }

  public async login(loginDto: LoginDto) {
    return await this.loginProvider.login(loginDto);
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }
}
