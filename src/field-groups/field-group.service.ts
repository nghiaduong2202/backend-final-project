import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateManyFieldGroupsDto } from './dtos/create-many-field-groups.dto';
import { UpdateFieldGroupDto } from './dtos/update-field-group.dto';
import { QueryRunner, Repository } from 'typeorm';
import { FieldGroup } from './field-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SportService } from 'src/sports/sport.service';
import { FieldService } from 'src/fields/field.service';
import { FacilityService } from 'src/facilities/facility.service';
import { CreateFieldGroupDto } from './dtos/create-field-group.dto';
import { Facility } from 'src/facilities/facility.entity';
import { TransactionManagerProvider } from 'src/common/providers/transaction-manager.provider';

@Injectable()
export class FieldGroupService {
  constructor(
    /**
     * inject fieldGroupRepository
     */
    @InjectRepository(FieldGroup)
    private readonly fieldGroupRepository: Repository<FieldGroup>,
    /**
     * inject sportService
     */
    private readonly sportService: SportService,
    /**
     * inject facilityService
     */
    @Inject(forwardRef(() => FacilityService))
    private readonly facilityService: FacilityService,
    /**
     * inject fieldService
     */
    @Inject(forwardRef(() => FieldService))
    private readonly fieldService: FieldService,
    /**
     * inject transactionManagerProvider
     */
    private readonly transactionManagerProvider: TransactionManagerProvider,
  ) {}

  public async findOneById(id: UUID, relations?: string[]) {
    const fieldGroup = await this.fieldGroupRepository.findOne({
      where: {
        id,
      },
      relations,
    });

    if (!fieldGroup) {
      throw new NotFoundException('Field Group not found');
    }

    return fieldGroup;
  }

  public async createMany(
    createManyFieldGroupsDto: CreateManyFieldGroupsDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    // get facility
    const facility = await this.facilityService.findOneById(facilityId, [
      'owner',
    ]);

    // check permission
    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to create new field group in this facility',
      );
    }

    // create field group with transaction
    await this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        for (const fieldGroup of createManyFieldGroupsDto.fieldGroups) {
          await this.createWithTransaction(fieldGroup, facility, queryRunner);
        }
      },
    );

    return {
      message: 'Create field group successfully',
    };
  }

  public async createWithTransaction(
    createFieldGroupDto: CreateFieldGroupDto,
    facility: Facility,
    queryRunner: QueryRunner,
  ) {
    /**
     * Check peak time and price increate here if needed
     */

    // get sport
    const sports = await this.sportService.findManyByIds(
      createFieldGroupDto.sportIds,
    );

    // create new field group
    const fieldGroup = queryRunner.manager.create(FieldGroup, {
      ...createFieldGroupDto,
      facility,
      sports,
    });

    // save new field group
    await queryRunner.manager.save(fieldGroup);

    // create new fields
    for (const field of createFieldGroupDto.fields) {
      await this.fieldService.createWithTransaction(
        field,
        fieldGroup,
        queryRunner,
      );
    }

    return fieldGroup;
  }

  public async update(
    updateFieldGroupDto: UpdateFieldGroupDto,
    fieldGroupId: UUID,
    ownerId: UUID,
  ) {
    // get fieldGroup
    const fieldGroup = await this.findOneById(fieldGroupId, ['facility.owner']);

    // check permisstion
    if (fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to update');
    }

    try {
      // update field group
      if (updateFieldGroupDto.name) fieldGroup.name = updateFieldGroupDto.name;

      if (updateFieldGroupDto.dimension)
        fieldGroup.dimension = updateFieldGroupDto.dimension;

      if (updateFieldGroupDto.surface)
        fieldGroup.surface = updateFieldGroupDto.surface;

      if (updateFieldGroupDto.basePrice)
        fieldGroup.basePrice = updateFieldGroupDto.basePrice;

      if (updateFieldGroupDto.peakEndTime1)
        fieldGroup.peakEndTime1 = updateFieldGroupDto.peakEndTime1;

      if (updateFieldGroupDto.peakStartTime1)
        fieldGroup.peakStartTime1 = updateFieldGroupDto.peakStartTime1;

      if (updateFieldGroupDto.priceIncrease1)
        fieldGroup.priceIncrease1 = updateFieldGroupDto.priceIncrease1;

      if (updateFieldGroupDto.peakEndTime2)
        fieldGroup.peakEndTime2 = updateFieldGroupDto.peakEndTime2;

      if (updateFieldGroupDto.peakStartTime2)
        fieldGroup.peakStartTime2 = updateFieldGroupDto.peakStartTime2;

      if (updateFieldGroupDto.priceIncrease2)
        fieldGroup.priceIncrease2 = updateFieldGroupDto.priceIncrease2;

      if (updateFieldGroupDto.peakEndTime3)
        fieldGroup.peakEndTime3 = updateFieldGroupDto.peakEndTime3;

      if (updateFieldGroupDto.peakStartTime3)
        fieldGroup.peakStartTime3 = updateFieldGroupDto.peakStartTime3;

      if (updateFieldGroupDto.priceIncrease3)
        fieldGroup.priceIncrease3 = updateFieldGroupDto.priceIncrease3;

      if (updateFieldGroupDto.sportIds) {
        const sports = await this.sportService.findManyByIds(
          updateFieldGroupDto.sportIds,
        );

        fieldGroup.sports = sports;
      }

      // save
      await this.fieldGroupRepository.save(fieldGroup);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      message: 'Update field group successfully',
    };
  }

  public async delete(fieldGroupId: UUID, ownerId: UUID) {
    // get fieldGroup
    const fieldGroup = await this.findOneById(fieldGroupId, ['facility.owner']);

    // check permission
    if (fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to delete this field group',
      );
    }

    // delete
    try {
      await this.fieldGroupRepository.remove(fieldGroup);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Delete field group successfully',
    };
  }

  public async getByFacility(facilityId: UUID) {
    return await this.fieldGroupRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
      },
      relations: {
        fields: true,
        sports: true,
      },
    });
  }

  // public async getAvailabilityFieldInFacility(
  //   getAvailabilityFieldInFacilityDto: GetAvailabilityFieldInFacilityDto,
  //   facilityId: UUID,
  // ) {
  //   // check start time before end time
  //   isBefore(
  //     getAvailabilityFieldInFacilityDto.startTime,
  //     getAvailabilityFieldInFacilityDto.endTime,
  //     'Start time must be before end time',
  //   );

  //   // get facility
  //   // const facility = await this.facilityService.findOne(facilityId);

  //   // check start time and end time is between open time and close time
  //   // isBetweenTime(
  //   //   getAvailabilityFieldInFacilityDto.startTime,
  //   //   getAvailabilityFieldInFacilityDto.endTime,
  //   //   facility.openTime,
  //   //   facility.closeTime,
  //   //   'Facility is not open or closed',
  //   // );

  //   // get many field group in facility
  //   const fieldGroups = await this.fieldGroupRepository.find({
  //     where: {
  //       facility: {
  //         id: facilityId,
  //       },
  //     },
  //     relations: {
  //       fields: {
  //         // bookings: true,
  //       },
  //       sports: true,
  //     },
  //   });

  //   // const startTime = getAvailabilityFieldInFacilityDto.startTime;
  //   // const endTime = getAvailabilityFieldInFacilityDto.endTime;
  //   // const date = getAvailabilityFieldInFacilityDto.date
  //   //   .toISOString()
  //   //   .split('T')[0];

  //   // field all field group have available field
  //   const availableFieldGroups = fieldGroups.filter((fieldGroup) => {
  //     for (const sport of fieldGroup.sports) {
  //       if (sport.id === getAvailabilityFieldInFacilityDto.sportId) {
  //         return true;
  //       }
  //     }

  //     return false;
  //   });
  //   // .map((fieldGroup) => ({
  //   //   ...fieldGroup,
  //   //   fields: fieldGroup.fields
  //   //     .filter((field) => {
  //   //       for (const booking of field.bookings) {
  //   //         if (
  //   //           booking.status !== BookingStatusEnum.CANCELLED &&
  //   //           String(booking.date) === String(date) &&
  //   //           durationOverlapTime(
  //   //             startTime,
  //   //             endTime,
  //   //             booking.startTime,
  //   //             booking.endTime,
  //   //           ) !== 0
  //   //         ) {
  //   //           return false;
  //   //         }
  //   //       }

  //   //       return true;
  //   //     })
  //   //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   //     .map(({ bookings, ...field }) => field),
  //   // }));

  //   // return result
  //   return availableFieldGroups.filter(
  //     (fieldGroup) => fieldGroup.fields.length,
  //   );
  // }
}
