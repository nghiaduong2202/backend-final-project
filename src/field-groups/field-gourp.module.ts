import { forwardRef, Module } from '@nestjs/common';
import { FieldGroupController } from './field-group.controller';
import { FieldGroupService } from './field-group.service';
import { CreateManyProvider } from './providers/create-many.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldGroup } from './field-group.entity';
import { FacilityModule } from 'src/facilities/facility.module';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { SportModule } from 'src/sports/sport.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FieldGroup]),
    forwardRef(() => FacilityModule),
    SportModule,
  ],
  controllers: [FieldGroupController],
  providers: [FieldGroupService, CreateManyProvider, GetByIdProvider],
  exports: [FieldGroupService],
})
export class FieldGroupModule {}
