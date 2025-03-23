import { forwardRef, Module } from '@nestjs/common';
import { FieldController } from './field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './field.entity';
import { FieldService } from './field.service';
import { FieldGroupModule } from 'src/field-groups/field-gourp.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Field]),
    forwardRef(() => FieldGroupModule),
    CommonModule,
  ],
  controllers: [FieldController],
  providers: [FieldService],
  exports: [FieldService],
})
export class FieldModule {}
