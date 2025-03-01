import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { Roles } from './decorators/role.decorator';
import { RoleEnum } from './enums/role.enum';

@Controller('auth')
@Roles(RoleEnum.NONE)
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
