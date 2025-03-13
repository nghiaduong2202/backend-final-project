import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateServicesDto } from '../dtos/create-services.dto';
import { UUID } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { Service } from '../service.entiry';
import { InjectRepository } from '@nestjs/typeorm';
import { FacilityService } from 'src/facilities/facility.service';
import { SportService } from 'src/sports/sport.service';

@Injectable()
export class CreateManyProvider {
  constructor(
    /**
     * inject service repository
     */
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
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
    createServicesDto: CreateServicesDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    // get facility
    const facility = await this.facilityService.getById(facilityId);

    // check owner have permission to create services in this facility
    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to create services in this facility',
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    // create services
    try {
      for (const serviceData of createServicesDto.servicesData) {
        const sport = await this.sportService.getById(serviceData.sportId);

        const service = queryRunner.manager.create('Service', {
          ...serviceData,
          sport,
          facility,
        });

        await queryRunner.manager.save(service);
      }

      await queryRunner.commitTransaction();

      // save services
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Create services failed', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }

    return {
      message: 'Create services successfully',
    };
  }
}
