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
import { FacilityImage } from './facility-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Facility, FacilityImage]),
    PeopleModule,
    forwardRef(() => FieldGroupModule),
    SportModule,
  ],
  controllers: [FacilityController],
  providers: [FacilityService, CreateFacilityProvider, GetFacilityByIdProvider],
  exports: [FacilityService],
})
export class FacilityModule {}
