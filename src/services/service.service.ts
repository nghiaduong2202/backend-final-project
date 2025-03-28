import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateServicesDto } from './dtos/create-services.dto';
import { UUID } from 'crypto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { GetAvailabilityServiceInFacilityDto } from './dtos/get-availability-service-in-facility.dto';
import { CreateServiceDto } from './dtos/create-service.dto';
import { Facility } from 'src/facilities/facility.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Service } from './service.entiry';
import { InjectRepository } from '@nestjs/typeorm';
import { SportService } from 'src/sports/sport.service';
import { FacilityService } from 'src/facilities/facility.service';
import { TransactionManagerProvider } from 'src/common/providers/transaction-manager.provider';
import { isBefore } from 'src/common/utils/is-before';
import { isBetweenTime } from 'src/common/utils/is-between-time';
import { durationOverlapTime } from 'src/common/utils/duration-overlap-time';

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
  ) {}

  public async findOne(serviceId: number, relations?: string[]) {
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

  public async findOneWithTransaction(
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
    createServicesDto: CreateServicesDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    // get facility
    const facility = await this.facilityService.findOne(facilityId, ['owner']);

    // check permission
    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to create services in this facility',
      );
    }

    // create services
    await this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        for (const serviceData of createServicesDto.servicesData) {
          await this.createWithTransaction(serviceData, facility, queryRunner);
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
    const sport = await this.sportService.getByIdWithTransaction(
      createServiceDto.sportId,
      queryRunner,
    );

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
    const service = await this.findOne(serviceId, ['facility.owner']);

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
        const sport = await this.sportService.getById(updateServiceDto.sportId);

        service.sport = sport;
      }

      await this.serviceRepository.save(service);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Update service successfully',
    };
  }

  public async getByFacility(facilityId: UUID, sportId?: number) {
    return await this.serviceRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
        sport: {
          id: sportId,
        },
      },
    });
  }

  public async delete(serviceId: number, ownerId: UUID) {
    // get service
    const service = await this.findOne(serviceId, ['facility.owner']);

    // check permission
    if (service.facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to delete');
    }

    // delete service
    try {
      await this.serviceRepository.delete(service);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Delete service successfully',
    };
  }

  public async getAvailabilityServiceInFacility(
    getAvailabilityServiceInFacility: GetAvailabilityServiceInFacilityDto,
    facilityId: UUID,
  ) {
    // check start time before end time
    isBefore(
      getAvailabilityServiceInFacility.startTime,
      getAvailabilityServiceInFacility.endTime,
      'Start time must be before end time',
    );

    // get facility
    const facility = await this.facilityService.findOne(facilityId, []);

    // check open or close
    isBetweenTime(
      getAvailabilityServiceInFacility.startTime,
      getAvailabilityServiceInFacility.endTime,
      facility.openTime,
      facility.closeTime,
      'Facility is not open or closed',
    );

    // get services
    const services = await this.serviceRepository.find({
      where: {
        facility: {
          id: facilityId,
        },
        sport: {
          id: getAvailabilityServiceInFacility.sportId,
        },
      },
      relations: {
        bookingServices: {
          booking: true,
        },
        sport: true,
      },
    });

    const date = getAvailabilityServiceInFacility.date
      .toISOString()
      .split('T')[0];

    const availabilityService = services
      .map((service) => ({
        ...service,
        bookingServices: service.bookingServices.filter((bookingService) => {
          if (
            String(bookingService.booking.date) === String(date) &&
            durationOverlapTime(
              getAvailabilityServiceInFacility.startTime,
              getAvailabilityServiceInFacility.endTime,
              bookingService.booking.startTime,
              bookingService.booking.endTime,
            ) !== 0
          ) {
            return true;
          }

          return false;
        }),
      }))
      .map(({ bookingServices, ...service }) => ({
        ...service,
        remain:
          service.amount -
          bookingServices.reduce((prev, curr) => prev + curr.quantity, 0),
      }));

    return availabilityService;
  }
}
