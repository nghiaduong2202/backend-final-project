import { forwardRef, Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { FacilityModule } from 'src/facilities/facility.module';
import { SportModule } from 'src/sports/sport.module';
import { LicenseModule } from 'src/licenses/license.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    FacilityModule,
    SportModule,
    forwardRef(() => LicenseModule),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
