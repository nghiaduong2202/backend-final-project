import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { FacilityService } from './providers/facility.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from './facility.entity';
import { CreateDraftProvider } from './providers/create-draft.provider';
import { GetFacilityByIdProvider } from './providers/get-facility-by-id.provider';
import { PeopleModule } from 'src/people/people.module';
import { GetMyFacilityProvider } from './providers/get-my-facility.provider';
import { ApproveFacilityProvider } from './providers/approve-facility.provider';
import { RejectFacilityProvider } from './providers/reject-facility.provider';
import { UpdateFacilityProvider } from './providers/update-facility.provider';
import { DeleteFacilityProvider } from './providers/delete-facility.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Facility]), PeopleModule],
  controllers: [FacilityController],
  providers: [
    FacilityService,
    CreateDraftProvider,
    GetFacilityByIdProvider,
    GetMyFacilityProvider,
    ApproveFacilityProvider,
    RejectFacilityProvider,
    UpdateFacilityProvider,
    DeleteFacilityProvider,
  ],
  exports: [FacilityService],
})
export class FacilityModule {}
