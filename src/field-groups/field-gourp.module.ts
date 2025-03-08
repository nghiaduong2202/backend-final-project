import { forwardRef, Module } from '@nestjs/common';
import { FieldGroupController } from './field-group.controller';
import { FieldGroupService } from './field-group.service';
import { CreateFieldGroupProvider } from './providers/create-field-group.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldGroup } from './field-group.entity';
import { FacilityModule } from 'src/facilities/facility.module';
import { GetFieldGroupByIdProvider } from './providers/get-field-group-by-id.provider';
import { SportModule } from 'src/sports/sport.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FieldGroup]),
    forwardRef(() => FacilityModule),
    SportModule,
  ],
  controllers: [FieldGroupController],
  providers: [
    FieldGroupService,
    CreateFieldGroupProvider,
    GetFieldGroupByIdProvider,
  ],
  exports: [FieldGroupService],
})
export class FieldGroupModule {}
