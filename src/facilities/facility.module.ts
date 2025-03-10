import { forwardRef, Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from './facility.entity';
import { PeopleModule } from 'src/people/people.module';
import { FacilityService } from './facility.service';
import { CreateFacilityProvider } from './providers/create-facility.provider';
import { FieldGroupModule } from 'src/field-groups/field-gourp.module';
import { GetFacilityByIdProvider } from './providers/get-facility-by-id.provider';
import { SportModule } from 'src/sports/sport.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { GetAllProvider } from './providers/get-all.provider';
import { GetMyFacilitiesProvider } from './providers/get-my-facilities.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Facility]),
    PeopleModule,
    forwardRef(() => FieldGroupModule),
    SportModule,
    CloudinaryModule,
  ],
  controllers: [FacilityController],
  providers: [
    FacilityService,
    CreateFacilityProvider,
    GetFacilityByIdProvider,
    GetAllProvider,
    GetMyFacilitiesProvider,
  ],
  exports: [FacilityService],
})
export class FacilityModule {}
