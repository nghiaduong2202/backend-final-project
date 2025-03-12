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
export class CreateManyProvider {
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

  public async createMany(
    createFieldsDto: CreateFieldsDto,
    fieldGroupId: UUID,
    ownerId: UUID,
  ) {
    const fieldGroup = await this.fieldGroupService.getById(fieldGroupId);

    if (fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to craete files',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      for (const fieldData of createFieldsDto.fieldsData) {
        const field = queryRunner.manager.create(Field, {
          ...fieldData,
          fieldGroup,
        });

        await queryRunner.manager.save(field);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error create new fields', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }

    return { message: 'create new fields successful' };
  }
}
