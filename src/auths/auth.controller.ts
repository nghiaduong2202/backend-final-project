import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthRoles } from './decorators/auth-role.decorator';
import { AuthRoleEnum } from './enums/auth-role.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
@AuthRoles(AuthRoleEnum.NONE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'login account (role: none)',
  })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: 'register account (role: none)',
  })
  @Post('/register')
  public register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: 'refresh token (role: none)',
  })
  @Put('/refresh-token')
  public refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
