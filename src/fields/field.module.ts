import { Module } from '@nestjs/common';
import { FieldController } from './field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './field.entity';
import { FieldService } from './field.service';
import { CreateManyProvider } from './providers/create-many.provider';
import { FieldGroupModule } from 'src/field-groups/field-gourp.module';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), FieldGroupModule],
  controllers: [FieldController],
  providers: [FieldService, CreateManyProvider],
  exports: [FieldService],
})
export class FieldModule {}
