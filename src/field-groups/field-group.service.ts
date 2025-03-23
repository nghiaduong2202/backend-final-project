import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateFieldGroupsDto } from './dtos/create-field-groups.dto';
import { UpdateFieldGroupDto } from './dtos/update-field-group.dto';
import { GetAvailabilityFieldInFacilityDto } from './dtos/get-availability-field-in-facility.dto';
import { QueryRunner, Repository } from 'typeorm';
import { FieldGroup } from './field-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isBefore } from 'src/common/utils/is-before';
import { SportService } from 'src/sports/sport.service';
import { FieldService } from 'src/fields/field.service';
import { FacilityService } from 'src/facilities/facility.service';
import { isBetweenTime } from 'src/common/utils/is-between-time';
import { BookingStatusEnum } from 'src/bookings/enums/booking-status.enum';
import { durationOverlapTime } from 'src/common/utils/duration-overlap-time';
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

  public async getById(id: UUID) {
    const fieldGroup = await this.fieldGroupRepository.findOne({
      where: {
        id,
      },
      relations: {
        facility: {
          owner: true,
        },
      },
    });

    if (!fieldGroup) {
      throw new NotFoundException('Field Group not found');
    }

    return fieldGroup;
  }

  public async createMany(
    createFieldGroupsDto: CreateFieldGroupsDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    // get facility
    const facility = await this.facilityService.findOne(facilityId, ['owner']);

    // check permission
    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to create new field group in this facility',
      );
    }

    // create field group with transaction
    await this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        for (const fieldGroupData of createFieldGroupsDto.fieldGroupsData) {
          await this.createWithTransaction(
            fieldGroupData,
            facility,
            queryRunner,
          );
        }
      },
    );

    return {
      message: 'Create field group successfully',
    };
  }

  public async createWithTransaction(
    createFieldGroupData: CreateFieldGroupDto,
    facility: Facility,
    queryRunner: QueryRunner,
  ) {
    // check peak start time and end time
    if (
      createFieldGroupData.peakStartTime &&
      createFieldGroupData.peakEndTime
    ) {
      isBefore(
        createFieldGroupData.peakStartTime,
        createFieldGroupData.peakEndTime,
        'Peak start time must be before peak end time',
      );
    }

    // get sport
    const sports = await this.sportService.getByManyId(
      createFieldGroupData.sportIds,
    );

    // create new field group
    const fieldGroup = queryRunner.manager.create(FieldGroup, {
      ...createFieldGroupData,
      facility,
      sports,
    });

    // save new field group
    await queryRunner.manager.save(fieldGroup);

    // create new fields
    for (const fieldData of createFieldGroupData.fieldsData) {
      await this.fieldService.createWithTransaction(
        fieldData,
        fieldGroup,
        queryRunner,
      );
    }

    return fieldGroup;
  }

  public async getByFacility(facilityId: UUID) {
    try {
      return await this.fieldGroupRepository.find({
        where: {
          facility: {
            id: facilityId,
          },
        },
        relations: {
          sports: true,
          fields: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(String(error));
    }
  }

  public async update(
    updateFieldGroupDto: UpdateFieldGroupDto,
    fieldGroupId: UUID,
    ownerId: UUID,
  ) {
    if (updateFieldGroupDto.peakEndTime && updateFieldGroupDto.peakStartTime) {
      isBefore(
        updateFieldGroupDto.peakStartTime,
        updateFieldGroupDto.peakEndTime,
        'Peak start time must be before peak end time',
      );
    }

    // get fieldGroup
    const fieldGroup = await this.getById(fieldGroupId);

    // check permisstion
    if (fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to update');
    }
    // update
    try {
      // update field group
      if (updateFieldGroupDto.name) fieldGroup.name = updateFieldGroupDto.name;
      if (updateFieldGroupDto.dimension)
        fieldGroup.dimension = updateFieldGroupDto.dimension;
      if (updateFieldGroupDto.surface)
        fieldGroup.surface = updateFieldGroupDto.surface;
      if (updateFieldGroupDto.basePrice)
        fieldGroup.basePrice = updateFieldGroupDto.basePrice;
      if (updateFieldGroupDto.peakEndTime)
        fieldGroup.peakEndTime = updateFieldGroupDto.peakEndTime;
      if (updateFieldGroupDto.peakStartTime)
        fieldGroup.peakStartTime = updateFieldGroupDto.peakStartTime;
      if (updateFieldGroupDto.priceIncrease)
        fieldGroup.priceIncrease = updateFieldGroupDto.priceIncrease;
      if (updateFieldGroupDto.sportIds) {
        const sports = await this.sportService.getByManyId(
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
    const fieldGroup = await this.getById(fieldGroupId);

    // check permission
    if (fieldGroup.facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to delete this field group',
      );
    }
    // delete
    try {
      await this.fieldGroupRepository.delete(fieldGroup);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Delete field group successfully',
    };
  }

  public async getAvailabilityFieldInFacility(
    getAvailabilityFieldInFacilityDto: GetAvailabilityFieldInFacilityDto,
    facilityId: UUID,
  ) {
    // check start time before end time
    isBefore(
      getAvailabilityFieldInFacilityDto.startTime,
      getAvailabilityFieldInFacilityDto.endTime,
      'Start time must be before end time',
    );

    // get facility
    const facility = await this.facilityService.findOne(facilityId);

    // check start time and end time is between open time and close time
    isBetweenTime(
      getAvailabilityFieldInFacilityDto.startTime,
      getAvailabilityFieldInFacilityDto.endTime,
      facility.openTime,
      facility.closeTime,
      'Facility is not open or closed',
    );

    // get many field group in facility
    const fieldGroups = await this.fieldGroupRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
      },
      relations: {
        fields: {
          bookings: true,
        },
        sports: true,
      },
    });

    const startTime = getAvailabilityFieldInFacilityDto.startTime;
    const endTime = getAvailabilityFieldInFacilityDto.endTime;
    const date = getAvailabilityFieldInFacilityDto.date
      .toISOString()
      .split('T')[0];

    // field all field group have available field
    const availableFieldGroups = fieldGroups
      .filter((fieldGroup) => {
        for (const sport of fieldGroup.sports) {
          if (sport.id === getAvailabilityFieldInFacilityDto.sportId) {
            return true;
          }
        }

        return false;
      })
      .map((fieldGroup) => ({
        ...fieldGroup,
        fields: fieldGroup.fields
          .filter((field) => {
            for (const booking of field.bookings) {
              if (
                booking.status !== BookingStatusEnum.CANCELLED &&
                String(booking.date) === String(date) &&
                durationOverlapTime(
                  startTime,
                  endTime,
                  booking.startTime,
                  booking.endTime,
                ) !== 0
              ) {
                return false;
              }
            }

            return true;
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ bookings, ...field }) => field),
      }));

    // return result
    return availableFieldGroups.filter(
      (fieldGroup) => fieldGroup.fields.length,
    );
  }
}
