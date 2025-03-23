import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFieldsDto } from './dtos/create-fields.dto';
import { UUID } from 'crypto';
import { UpdateFieldDto } from './dtos/update-field.dto';
import { QueryRunner, Repository } from 'typeorm';
import { Field } from './field.entity';
import { FieldGroup } from 'src/field-groups/field-group.entity';
import { FieldGroupService } from 'src/field-groups/field-group.service';
import { TransactionManagerProvider } from 'src/common/providers/transaction-manager.provider';
import { CreateFieldDto } from './dtos/create-field.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FieldService {
  constructor(
    /**
     * inject fieldGroupService
     */
    @Inject(forwardRef(() => FieldGroupService))
    private readonly fieldGroupService: FieldGroupService,
    /**
     * inject transactionManagerProvider
     */
    private readonly transactionManagerProvider: TransactionManagerProvider,
    /**
     * inject fieldRepository
     */
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
  ) {}

  public async findOne(fieldId: number, relations?: string[]) {
    const field = await this.fieldRepository.findOne({
      where: {
        id: fieldId,
      },
      relations: relations,
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    return field;
  }

  public async createMany(
    createFieldsDto: CreateFieldsDto,
    fieldGroupId: UUID,
    ownerId: UUID,
  ) {
    // get fieldGroup by id
    const fieldGroup = await this.fieldGroupService.getById(fieldGroupId);

    // check permission
    if (fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to create fields',
      );
    }
    // create fields
    await this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        for (const fieldData of createFieldsDto.fieldsData) {
          await this.createWithTransaction(fieldData, fieldGroup, queryRunner);
        }
      },
    );

    return {
      message: 'Create fields successfully',
    };
  }

  public async createWithTransaction(
    createFieldDto: CreateFieldDto,
    fieldGroup: FieldGroup,
    queryRunner: QueryRunner,
  ) {
    const field = queryRunner.manager.create(Field, {
      ...createFieldDto,
      fieldGroup,
    });

    await queryRunner.manager.save(field);
  }

  public async getByFieldGroup(fieldGroupId: UUID) {
    return await this.fieldRepository.find({
      where: {
        fieldGroup: {
          id: fieldGroupId,
        },
      },
    });
  }

  public async update(
    updateFieldDto: UpdateFieldDto,
    fieldId: number,
    ownerId: UUID,
  ) {
    // get filed by id
    const field = await this.findOne(fieldId, ['fieldGroup.facility.owner']);

    // check permission
    if (field.fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to update');
    }

    // update field
    try {
      if (updateFieldDto.name) field.name = updateFieldDto.name;

      await this.fieldRepository.save(field);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Update field successfully',
    };
  }

  public async getById(fieldId: number) {
    return await this.findOne(fieldId, ['fieldGroup', 'fieldGroup.sports']);
  }

  public async delete(fieldId: number, ownerId: UUID) {
    // get field by id
    const field = await this.findOne(fieldId, ['fieldGroup.facility.owner']);

    // check permission
    if (field.fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to delete');
    }

    // delete field
    try {
      await this.fieldRepository.delete(fieldId);
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }

  public async getByIdWithTransaction(
    fieldId: number,
    queryRunner: QueryRunner,
  ) {
    const field = await queryRunner.manager.findOne(Field, {
      where: { id: fieldId },
      relations: {
        fieldGroup: {
          sports: true,
          facility: true,
        },
      },
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    return field;
  }
}
