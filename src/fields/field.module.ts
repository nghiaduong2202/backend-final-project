import { Module } from '@nestjs/common';
import { FieldController } from './field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './field.entity';
import { FieldService } from './field.service';
import { CreateFieldsProvider } from './providers/create-fields.provider';
import { FieldGroupModule } from 'src/field-groups/field-gourp.module';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), FieldGroupModule],
  controllers: [FieldController],
  providers: [FieldService, CreateFieldsProvider],
  exports: [FieldService],
})
export class FieldModule {}
