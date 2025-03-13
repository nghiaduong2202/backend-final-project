import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateServiceDto } from '../dtos/update-service.dto';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Service } from '../service.entiry';
import { InjectRepository } from '@nestjs/typeorm';
import { SportService } from 'src/sports/sport.service';

@Injectable()
export class UpdateProvider {
  constructor(
    /**
     * inject service repository
     */
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    /**
     * inject sport service
     */
    private readonly sportService: SportService,
  ) {}

  public async update(
    updateServiceDto: UpdateServiceDto,
    serviceId: number,
    ownerId: UUID,
  ) {
    // get service
    const service = await this.serviceRepository.findOne({
      where: {
        id: serviceId,
      },
      relations: {
        facility: {
          owner: true,
        },
      },
    });

    // check service exist
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // check owner have permission to update
    if (service.facility.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to update');
    }

    try {
      // update service
      // save

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
      throw new BadRequestException(error);
    }

    return {
      message: 'Update service successful',
    };
  }
}
