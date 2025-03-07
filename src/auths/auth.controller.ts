import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthRoles } from './decorators/auth-role.decorator';
import { AuthRoleEnum } from './enums/auth-role.enum';

@Controller('auth')
@AuthRoles(AuthRoleEnum.NONE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  public register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
