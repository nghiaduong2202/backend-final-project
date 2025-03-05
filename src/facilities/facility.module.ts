import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { FacilityService } from './providers/facility.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from './facility.entity';
import { CreateDraftProvider } from './providers/create-draft.provider';
import { GetFacilityByIdProvider } from './providers/get-facility-by-id.provider';
import { PeopleModule } from 'src/people/people.module';
import { GetMyFacilityProvider } from './providers/get-my-facility.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Facility]), PeopleModule],
  controllers: [FacilityController],
  providers: [
    FacilityService,
    CreateDraftProvider,
    GetFacilityByIdProvider,
    GetMyFacilityProvider,
  ],
  exports: [FacilityService],
})
export class FacilityModule {}
