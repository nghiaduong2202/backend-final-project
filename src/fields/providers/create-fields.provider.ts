import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Field } from '../field.entity';
import { FieldGroupService } from 'src/field-groups/field-group.service';
import { CreateFieldsDto } from '../dtos/create-fields.dto';
import { UUID } from 'crypto';

@Injectable()
export class CreateFieldsProvider {
  constructor(
    /**
     * inject field group service
     */
    private readonly fieldGroupService: FieldGroupService,
    /**
     * inject data source
     */
    private readonly dataSource: DataSource,
  ) {}

  public async createFields(
    createFieldsDto: CreateFieldsDto,
    fieldGroupId: UUID,
    ownerId: UUID,
  ) {
    const fieldGroup =
      await this.fieldGroupService.getFieldGroupById(fieldGroupId);

    if (fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to craete files',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      for (const createFieldDto of createFieldsDto.fields) {
        const field = queryRunner.manager.create(Field, createFieldDto);

        await queryRunner.manager.save({
          ...field,
          fieldGroup,
        });
      }

      await queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }

    return;
  }
}
