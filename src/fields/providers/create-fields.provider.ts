import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { Field } from '../field.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityService } from 'src/facilities/providers/facility.service';
import { CreateFieldsDto } from '../dtos/create-fields.dto';
import { FacilityStatusEnum } from 'src/facilities/enums/facility-status.enum';
import { Facility } from 'src/facilities/facility.entity';
import { SportService } from 'src/sports/providers/sport.service';
import { PeopleService } from 'src/people/providers/people.service';
import { UUID } from 'crypto';

@Injectable()
export class CreateFieldsProvider {
  constructor(
    /**
     * inject field repository
     */
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
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
    /**
     * inject people service
     */
    private readonly peopleService: PeopleService,
  ) {}

  public async createFields(createFieldsDto: CreateFieldsDto, ownerId: UUID) {
    const owner = await this.peopleService.getPeopleById(ownerId);

    console.log(owner.id);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    const facility = await this.createFacility(
      createFieldsDto.facilityId,
      queryRunner,
    );

    console.log(facility);

    if (facility.owner.id !== owner.id) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw new BadRequestException('You are not the owner of this facility');
    }

    try {
      for (const createFieldDto of createFieldsDto.fields) {
        const sports = await this.sportService.getSportByIds(
          createFieldDto.sportIds,
        );

        let field = queryRunner.manager.create(Field, {
          ...createFieldDto,
          sports,
          facility,
        });

        field = await queryRunner.manager.save(Field, field);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new BadRequestException('Error creating fields', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }

    return {
      mesage: 'Fields created successfully',
    };
  }

  private async createFacility(id: number, queryRunner: QueryRunner) {
    const facility = await this.facilityService.getFacilityById(id);

    if (!facility) {
      throw new BadRequestException('Facility not found');
    }

    if (facility.status === FacilityStatusEnum.DRAFT) {
      facility.status = FacilityStatusEnum.PENDING;
      await queryRunner.manager.save(Facility, facility);
    }

    return facility;
  }
}
