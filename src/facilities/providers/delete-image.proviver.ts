import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { DeleteImageDto } from '../dtos/delete-image.dto';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeleteImageProviver {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
  ) {}

  public async deleteImage(
    deleteImageDto: DeleteImageDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    const facility = await this.facilityRepository.findOne({
      where: {
        id: facilityId,
      },
      relations: {
        owner: true,
      },
    });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to update this facility',
      );
    }

    facility.imagesUrl = facility.imagesUrl?.filter(
      (image) => image !== deleteImageDto.image,
    );

    await this.facilityRepository.save(facility);

    return {
      message: 'Delete image successfull',
    };
  }
}
