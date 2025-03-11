import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FieldGroup } from '../field-group.entity';
import { CreateFieldGroupsDto } from '../dtos/create-field-groups.dto';
import { UUID } from 'crypto';
import { FacilityService } from 'src/facilities/facility.service';
import { Field } from 'src/fields/field.entity';
import { SportService } from 'src/sports/sport.service';

@Injectable()
export class CreateManyProvider {
  constructor(
    /**
     * inject facility service
     */
    private readonly facilityService: FacilityService,
    /**
     * inject data source
     */
    private readonly dataSource: DataSource,
    /**
     * inject sport service
     */
    private readonly sportService: SportService,
  ) {}

  public async createMany(
    createFieldGroupsDto: CreateFieldGroupsDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    /**
     * get facility
     */
    const facility = await this.facilityService.getById(facilityId);

    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to create');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const fieldGroupData of createFieldGroupsDto.fieldGroupsData) {
        /** get sports add to new field group */
        const sports = await this.sportService.getByManyId(
          fieldGroupData.sportIds,
        );

        /**
         * create new field group
         */
        const fieldGroup = queryRunner.manager.create(FieldGroup, {
          ...fieldGroupData,
          facility,
          sports,
        });

        await queryRunner.manager.save(fieldGroup);

        const fieldsData = fieldGroupData.fieldsData;

        /**
         * create fields into new field group
         */
        for (const fieldData of fieldsData) {
          const field = queryRunner.manager.create(Field, {
            ...fieldData,
            fieldGroup,
          });

          await queryRunner.manager.save(field);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error create new field group', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }

    return {
      message: 'Create new field groups successful',
    };
  }
}
