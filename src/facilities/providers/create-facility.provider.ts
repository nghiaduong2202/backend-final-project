import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateFacilityDto } from '../dtos/create-facility.dto';
import { Facility } from '../facility.entity';
import { FieldGroup } from 'src/field-groups/field-group.entity';
import { Field } from 'src/fields/field.entity';
import { PeopleService } from 'src/people/providers/people.service';
import { UUID } from 'crypto';

@Injectable()
export class CreateFacilityProvider {
  constructor(
    /**
     * inject data source
     */
    private readonly dataSource: DataSource,
    /**
     * inject people service
     */
    private readonly peopleService: PeopleService,
  ) {}

  public async createFacility(
    createFacilityDto: CreateFacilityDto,
    ownerId: UUID,
  ) {
    const owner = await this.peopleService.getPeopleById(ownerId);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const facility = queryRunner.manager.create(Facility, {
        ...createFacilityDto,
        owner,
      });

      await queryRunner.manager.save(facility);

      const createFieldGroupsDto = createFacilityDto.fieldGroups;

      for (const createFieldGroupDto of createFieldGroupsDto) {
        const fieldGroup = queryRunner.manager.create(FieldGroup, {
          ...createFieldGroupDto,
          facility,
        });

        await queryRunner.manager.save(fieldGroup);

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
    } catch {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }

    return {
      message: 'Create new facility successful',
    };
  }
}
