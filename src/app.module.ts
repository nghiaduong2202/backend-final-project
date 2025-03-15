import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auths/auth.module';
import { PeopleModule } from './people/people.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthRoleGuard } from './auths/guards/auth-role.guard';
import { AdminGuard } from './auths/guards/admin.guard';
import { PlayerGuard } from './auths/guards/player.guard';
import { OwnerGuard } from './auths/guards/owner.guard';
import { JwtModule } from '@nestjs/jwt';
import { FacilityModule } from './facilities/facility.module';
import { SportModule } from './sports/sport.module';
import { FieldModule } from './fields/field.module';
import { FieldGroupModule } from './field-groups/field-gourp.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { VoucherModule } from './vouchers/voucher.module';
import { ServiceModule } from './services/service.module';
import { BookingModule } from './bookings/booking.module';
// import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: configService.get<boolean>('DATABASE_AUTOLOAD'),
        synchronize: configService.get<boolean>('DATABASE_SYNC'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        host: configService.get<string>('DATABASE_HOST'),
        database: configService.get<string>('DATABASE_NAME'),
        // ssl: {
        //   rejectUnauthorized: true,
        //   ca: fs.readFileSync('./ca.pem').toString(),
        // },
      }),
    }),
    AuthModule,
    PeopleModule,
    JwtModule,
    FacilityModule,
    SportModule,
    FieldModule,
    FieldGroupModule,
    CloudinaryModule,
    VoucherModule,
    ServiceModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthRoleGuard,
    },
    AdminGuard,
    PlayerGuard,
    OwnerGuard,
  ],
})
export class AppModule {}
