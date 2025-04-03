import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateManyServicesDto } from './dtos/create-many-services.dto';
import { UUID } from 'crypto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { CreateServiceDto } from './dtos/create-service.dto';
import { Facility } from 'src/facilities/facility.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Service } from './service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SportService } from 'src/sports/sport.service';
import { FacilityService } from 'src/facilities/facility.service';
import { TransactionManagerProvider } from 'src/common/providers/transaction-manager.provider';
import { LicenseService } from 'src/licenses/license.service';

@Injectable()
export class ServiceService {
  constructor(
    /**
     * inject serviceRepository
     */
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    /**
     * inject sportSerivce
     */
    private readonly sportService: SportService,
    /**
     * inject facilityService
     */
    private readonly facilityService: FacilityService,
    /**
     * inject transactionManagerProvider
     */
    private readonly transactionManagerProvider: TransactionManagerProvider,
    /**
     * inject licenseService
     */
    @Inject(forwardRef(() => LicenseService))
    private readonly licenseService: LicenseService,
  ) {}

  public async findOneById(serviceId: number, relations?: string[]) {
    const service = await this.serviceRepository.findOne({
      where: {
        id: serviceId,
      },
      relations: relations,
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  public async findOneByIdWithTransaction(
    serviceId: number,
    queryRunner: QueryRunner,
    relations?: string[],
  ) {
    const service = await queryRunner.manager.findOne(Service, {
      where: {
        id: serviceId,
      },
      relations: relations,
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  public async createMany(
    createManyServicesDto: CreateManyServicesDto,
    ownerId: UUID,
  ) {
    // get facility
    const facility = await this.facilityService.findOneById(
      createManyServicesDto.facilityId,
      ['owner'],
    );

    // check permission
    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to create services in this facility',
      );
    }

    // create services
    await this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        for (const service of createManyServicesDto.services) {
          await this.createWithTransaction(service, facility, queryRunner);
        }
      },
    );

    return {
      message: 'Create services successfully',
    };
  }

  public async createWithTransaction(
    createServiceDto: CreateServiceDto,
    facility: Facility,
    queryRunner: QueryRunner,
  ) {
    const sport = await this.sportService.findOneByIdWithTransaction(
      createServiceDto.sportId,
      queryRunner,
    );

    // check facility have license for this sport
    const license = await this.licenseService.findOneWithTransaction(
      facility.id,
      createServiceDto.sportId,
      queryRunner,
    );

    if (!license.verified) {
      throw new BadRequestException(
        `You must update your license for the ${sport.name} sport first`,
      );
    }

    const service = queryRunner.manager.create(Service, {
      ...createServiceDto,
      sport,
      facility,
    });

    await queryRunner.manager.save(service);
  }

  public async update(
    updateServiceDto: UpdateServiceDto,
    serviceId: number,
    ownerId: UUID,
  ) {
    // get service
    const service = await this.findOneById(serviceId, ['facility.owner']);

    // check permission
    if (service.facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to update');
    }

    // update service
    try {
      if (updateServiceDto.name) service.name = updateServiceDto.name;
      if (updateServiceDto.amount) service.amount = updateServiceDto.amount;
      if (updateServiceDto.description)
        service.description = updateServiceDto.description;
      if (updateServiceDto.price) service.price = updateServiceDto.price;
      if (updateServiceDto.sportId) {
        const sport = await this.sportService.findOneById(
          updateServiceDto.sportId,
        );

        service.sport = sport;
      }

      if (updateServiceDto.unit) service.unit = updateServiceDto.unit;

      await this.serviceRepository.save(service);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Update service successfully',
    };
  }

  public async getByFacility(facilityId: UUID) {
    const services = await this.serviceRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
      },
      relations: {
        sport: true,
        additionalServices: {
          booking: {
            bookingSlots: true,
          },
        },
      },
      order: {
        name: 'DESC',
      },
    });

    const now = new Date(new Date().toString().split('T')[0]);

    return services.map(({ additionalServices, ...service }) => ({
      ...service,
      bookedCountOnDate: additionalServices.filter((additionalService) =>
        additionalService.booking.bookingSlots
          .flat()
          .filter((bookingSlot) => bookingSlot.date === now),
      ).length,
    }));
  }

  public async delete(serviceId: number, ownerId: UUID) {
    // get service
    const service = await this.findOneById(serviceId, ['facility.owner']);

    // check permission
    if (service.facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to delete');
    }

    // delete service
    try {
      await this.serviceRepository.remove(service);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Delete service successfully',
    };
  }

  // public async getAvailabilityServiceInFacility(
  //   getAvailabilityServiceInFacility: GetAvailabilityServiceInFacilityDto,
  //   facilityId: UUID,
  // ) {
  //   // check start time before end time
  //   isBefore(
  //     getAvailabilityServiceInFacility.startTime,
  //     getAvailabilityServiceInFacility.endTime,
  //     'Start time must be before end time',
  //   );

  //   // get facility
  //   const facility = await this.facilityService.findOne(facilityId, []);

  //   // check open or close
  //   isBetweenTime(
  //     getAvailabilityServiceInFacility.startTime,
  //     getAvailabilityServiceInFacility.endTime,
  //     facility.openTime,
  //     facility.closeTime,
  //     'Facility is not open or closed',
  //   );

  //   // get services
  //   const services = await this.serviceRepository.find({
  //     where: {
  //       facility: {
  //         id: facilityId,
  //       },
  //       sport: {
  //         id: getAvailabilityServiceInFacility.sportId,
  //       },
  //     },
  //     relations: {
  //       bookingServices: {
  //         booking: true,
  //       },
  //       sport: true,
  //     },
  //   });

  //   const date = getAvailabilityServiceInFacility.date
  //     .toISOString()
  //     .split('T')[0];

  //   const availabilityService = services
  //     .map((service) => ({
  //       ...service,
  //       bookingServices: service.bookingServices.filter((bookingService) => {
  //         if (
  //           String(bookingService.booking.date) === String(date) &&
  //           durationOverlapTime(
  //             getAvailabilityServiceInFacility.startTime,
  //             getAvailabilityServiceInFacility.endTime,
  //             bookingService.booking.startTime,
  //             bookingService.booking.endTime,
  //           ) !== 0
  //         ) {
  //           return true;
  //         }

  //         return false;
  //       }),
  //     }))
  //     .map(({ bookingServices, ...service }) => ({
  //       ...service,
  //       remain:
  //         service.amount -
  //         bookingServices.reduce((prev, curr) => prev + curr.quantity, 0),
  //     }));

  //   return availabilityService;
  // }
}
