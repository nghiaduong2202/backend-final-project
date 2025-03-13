import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Service } from '../service.entiry';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeleteProvider {
  constructor(
    /**
     * inject service repository
     */
    @InjectRepository(Service)
    private readonly deleteRepository: Repository<Service>,
  ) {}

  public async delete(serviceId: number, ownerId: UUID) {
    // get service
    const service = await this.deleteRepository.findOne({
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

    // delete service
    try {
      await this.deleteRepository.delete(service);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return {
      message: 'Delete service successfully',
    };
  }
}
