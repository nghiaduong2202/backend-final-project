import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Facility } from '../facility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FacilityStatusEnum } from '../enums/facility-status.enum';

@Injectable()
export class UpdateImagesProvider {
  constructor(
    /**
     * inject facility repository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    /**
     * inject cloudinary service
     */
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async updateImages(
    images: Express.Multer.File[],
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

    try {
      for (const image of images) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { secure_url } = await this.cloudinaryService.uploadImage(image);

        facility.imagesUrl?.push(String(secure_url));
      }

      facility.status = FacilityStatusEnum.PENDING;
      await this.facilityRepository.save(facility);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return {
      message: 'Images updated successfully',
    };
  }
}
