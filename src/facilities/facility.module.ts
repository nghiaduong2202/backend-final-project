import { forwardRef, Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from './facility.entity';
import { PeopleModule } from 'src/people/people.module';
import { FacilityService } from './facility.service';
import { CreateProvider } from './providers/create.provider';
import { FieldGroupModule } from 'src/field-groups/field-gourp.module';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { SportModule } from 'src/sports/sport.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { GetAllProvider } from './providers/get-all.provider';
import { GetByOwnerProvider } from './providers/get-by-owner.provider';

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
    CreateProvider,
    GetByIdProvider,
    GetAllProvider,
    GetByOwnerProvider,
  ],
  exports: [FacilityService],
})
export class FacilityModule {}
