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

@Injectable()
export class CreateFieldGroupProvider {
  constructor(
    /**
     * inject facility service
     */
    private readonly facilityService: FacilityService,
    /**
     * inject data source
     */
    private readonly dataSource: DataSource,
  ) {}

  public async createFieldGroups(
    createFieldGroupsDto: CreateFieldGroupsDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    const facility = await this.facilityService.getFacilityById(facilityId);

    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException();
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const createFieldGroupDto of createFieldGroupsDto.fieldGroups) {
        const fieldGroup = queryRunner.manager.create(FieldGroup, {
          ...createFieldGroupDto,
          facility,
        });

        console.log('🚀 ~ CreateFieldGroupProvider ~ fieldGroup:', fieldGroup);
        await queryRunner.manager.save(fieldGroup);
        console.log(
          '-------------------------------------------------------------',
        );
        const createFieldsDto = createFieldGroupDto.createFieldsDto;

        for (const createFieldDto of createFieldsDto) {
          const field = queryRunner.manager.create(Field, {
            ...createFieldDto,
            fieldGroup,
          });

          await queryRunner.manager.save(field);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('some thing wrong', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }

    return {
      message: 'Create successful',
    };
  }
}
