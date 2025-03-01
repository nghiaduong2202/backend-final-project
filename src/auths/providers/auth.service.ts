import { Injectable } from '@nestjs/common';
import { RegisterProvider } from './register.provider';
import { RegisterDto } from '../dtos/register.dto';
import { LoginProvider } from './login.provider';
import { LoginDto } from '../dtos/login.dto';

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
  ) {}

  public async register(registerDto: RegisterDto) {
    return await this.registerProvider.register(registerDto);
  }

  public async login(loginDto: LoginDto) {
    return await this.loginProvider.login(loginDto);
  }
}
