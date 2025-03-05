import { Module } from '@nestjs/common';
import { FieldController } from './field.controller';
import { FieldService } from './providers/field.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './field.entity';
import { FacilityModule } from 'src/facilities/facility.module';
import { CreateFieldsProvider } from './providers/create-fields.provider';
import { SportModule } from 'src/sports/sport.module';
import { PeopleModule } from 'src/people/people.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Field]),
    FacilityModule,
    SportModule,
    PeopleModule,
  ],
  controllers: [FieldController],
  providers: [FieldService, CreateFieldsProvider],
})
export class FieldModule {}
