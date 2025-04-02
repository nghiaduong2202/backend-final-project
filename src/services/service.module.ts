import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { FacilityModule } from 'src/facilities/facility.module';
import { SportModule } from 'src/sports/sport.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), FacilityModule, SportModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
