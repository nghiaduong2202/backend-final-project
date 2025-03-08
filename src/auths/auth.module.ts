import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashProvider } from './providers/hash.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { LoginProvider } from './providers/login.provider';
import { PeopleModule } from 'src/people/people.module';
import { RegisterProvider } from './providers/register.provider';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GenerateTokenProvider } from './providers/generate-token.provider';
import { RefreshTokenProvider } from './providers/refresh-token.provider';

@Module({
  imports: [
    PeopleModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE'),
          issuer: configService.get<string>('JWT_TOKEN_ISSUER'),
          audience: configService.get<string>('JWT_TOKEN_AUDIENCE'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashProvider,
      useClass: BcryptProvider,
    },
    LoginProvider,
    RegisterProvider,
    GenerateTokenProvider,
    RefreshTokenProvider,
  ],
  exports: [AuthService],
})
export class AuthModule {}
