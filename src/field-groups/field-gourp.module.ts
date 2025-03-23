import { forwardRef, Module } from '@nestjs/common';
import { FieldGroupController } from './field-group.controller';
import { FieldGroupService } from './field-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldGroup } from './field-group.entity';
import { FacilityModule } from 'src/facilities/facility.module';
import { SportModule } from 'src/sports/sport.module';
import { FieldModule } from 'src/fields/field.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FieldGroup]),
    forwardRef(() => FacilityModule),
    SportModule,
    forwardRef(() => FieldModule),
  ],
  controllers: [FieldGroupController],
  providers: [FieldGroupService],
  exports: [FieldGroupService],
})
export class FieldGroupModule {}
