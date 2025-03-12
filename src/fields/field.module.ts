import { Module } from '@nestjs/common';
import { FieldController } from './field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './field.entity';
import { FieldService } from './field.service';
import { CreateManyProvider } from './providers/create-many.provider';
import { FieldGroupModule } from 'src/field-groups/field-gourp.module';
import { GetByFieldGroupProvider } from './providers/get-by-field-group.provider';
import { UpdateProvider } from './providers/update.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), FieldGroupModule],
  controllers: [FieldController],
  providers: [FieldService, CreateManyProvider, GetByFieldGroupProvider, UpdateProvider],
  exports: [FieldService],
})
export class FieldModule {}
