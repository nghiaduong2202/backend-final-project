import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateManyFieldsDto } from './dtos/create-many-fields.dto';
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

  public async findOneById(fieldId: number, relations?: string[]) {
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

  public async findOneWithTransaction(
    fieldId: number,
    queryRunner: QueryRunner,
    relations?: string[],
  ) {
    const field = await queryRunner.manager.findOne(Field, {
      where: {
        id: fieldId,
      },
      relations,
    });

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    return field;
  }

  public async createMany(
    createManyFieldsDto: CreateManyFieldsDto,
    fieldGroupId: UUID,
    ownerId: UUID,
  ) {
    // get fieldGroup by id
    const fieldGroup = await this.fieldGroupService.findOneById(fieldGroupId, [
      'facility.owner',
    ]);

    // check permission
    if (fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to create fields',
      );
    }

    // create fields
    await this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        for (const field of createManyFieldsDto.fields) {
          await this.createWithTransaction(field, fieldGroup, queryRunner);
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

  public async update(updateFieldDto: UpdateFieldDto, ownerId: UUID) {
    // get filed by id
    const field = await this.findOneById(updateFieldDto.id, [
      'fieldGroup.facility.owner',
    ]);

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

  public async delete(fieldId: number, ownerId: UUID) {
    // get field by id
    const field = await this.findOneById(fieldId, [
      'fieldGroup.facility.owner',
    ]);

    // check permission
    if (field.fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to delete');
    }

    // delete field
    try {
      await this.fieldRepository.remove(field);
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }
}
