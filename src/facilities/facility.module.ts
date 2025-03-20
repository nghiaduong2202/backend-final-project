import { forwardRef, Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from './facility.entity';
import { PeopleModule } from 'src/people/people.module';
import { FacilityService } from './facility.service';
import { CreateProvider } from './providers/create.provider';
import { FieldGroupModule } from 'src/field-groups/field-gourp.module';
import { SportModule } from 'src/sports/sport.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Facility]),
    PeopleModule,
    forwardRef(() => FieldGroupModule),
    SportModule,
    CloudinaryModule,
  ],
  controllers: [FacilityController],
  providers: [FacilityService, CreateProvider],
  exports: [FacilityService],
})
export class FacilityModule {}
