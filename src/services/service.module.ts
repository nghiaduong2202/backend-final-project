import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entiry';
import { CreateManyProvider } from './providers/create-many.provider';
import { FacilityModule } from 'src/facilities/facility.module';
import { SportModule } from 'src/sports/sport.module';
import { UpdateProvider } from './providers/update.provider';
import { GetByFacilityProvider } from './providers/get-by-facility.provider';
import { DeleteProvider } from './providers/delete.provider';
import { GetAvailabilityServiceInFacilityProvider } from './providers/get-availability-service-in-facility.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), FacilityModule, SportModule],
  controllers: [ServiceController],
  providers: [ServiceService, CreateManyProvider, UpdateProvider, GetByFacilityProvider, DeleteProvider, GetAvailabilityServiceInFacilityProvider],
})
export class ServiceModule {}
