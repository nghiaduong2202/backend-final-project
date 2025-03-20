import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateFacilityDto } from './dtos/create-facility.dto';
import { DeleteImagesDto } from './dtos/delete-images.dto';
import { UpdateFacilityDto } from './dtos/update-facility.dto';
import { TransactionManagerProvider } from 'src/common/providers/transaction-manager.provider';
import { Repository } from 'typeorm';
import { Facility } from './facility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { isBefore } from 'src/utils/is-before';

@Injectable()
export class FacilityService {
  constructor(
    /**
     * inject transactionManagerProvider
     */
    private readonly transactionManagerProvider: TransactionManagerProvider,
    /**
     * inject facilityRepository
     */
    @InjectRepository(Facility)
    private readonly facilityRepository: Repository<Facility>,
    /**
     * inject cloudinaryService
     */
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async getById(facilityId: UUID) {
    // get facility
    const facility = await this.facilityRepository.findOne({
      where: {
        id: facilityId,
      },
      relations: {
        owner: true,
        fieldGroups: {
          sports: true,
        },
      },
    });

    // check exist
    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    const { fieldGroups, ...rest } = facility;

    return {
      ...rest,
      sports: fieldGroups
        .map((fieldGroup) => fieldGroup.sports)
        .flat()
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        ),
    };
  }

  public async create(
    createFacilityDto: CreateFacilityDto,
    images: Express.Multer.File[],
    ownerId: UUID,
  ) {
    // check open time is before close time
    // create new facility
    // create many field group

    return {
      message: 'Facility created successfully',
    };
  }

  public async getAll() {
    // get all facilities
    const facilities = await this.facilityRepository.find({
      relations: {
        owner: true,
        fieldGroups: {
          sports: true,
        },
      },
    });

    // return
    return facilities.map(({ fieldGroups, ...facility }) => ({
      ...facility,
      sports: fieldGroups
        .map((fieldGroup) => fieldGroup.sports)
        .flat()
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        ),
    }));
  }

  public async getByOwner(ownerId: UUID) {
    // get facility by owner id
    const facilities = await this.facilityRepository.find({
      where: {
        owner: {
          id: ownerId,
        },
      },
    });

    // return
    return facilities;
  }

  public async updateImages(
    images: Express.Multer.File[],
    facilityId: UUID,
    ownerId: UUID,
  ) {
    // get facility by id
    const faclity = await this.getById(facilityId);
    // check owner have permission to update image into this facility
    if (faclity.owner.id !== ownerId) {
      throw new NotAcceptableException('You do not have permission to update');
    }
    // update images
    try {
      for (const image of images) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { secure_url } = await this.cloudinaryService.uploadImage(image);

        faclity.imagesUrl?.push(String(secure_url));
      }

      await this.facilityRepository.save(faclity);
    } catch (error) {
      throw new BadRequestException(String(error));
    }
    return {
      message: 'Images updated successfully',
    };
  }

  public async deleteImages(
    deleteImagesDto: DeleteImagesDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    // get facility by id
    const facility = await this.getById(facilityId);

    // check owner have permission to delete this image
    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to delete this image',
      );
    }

    // delete image from cloudinary, implement later

    // delete image from facility
    facility.imagesUrl = facility.imagesUrl?.filter(
      (image) => !deleteImagesDto.images.includes(image),
    );

    await this.facilityRepository.save(facility);

    return {
      message: 'Image deleted successfully',
    };
  }

  public async update(
    updateFacilityDto: UpdateFacilityDto,
    facilityId: UUID,
    ownerId: UUID,
  ) {
    // get facility by id
    const facility = await this.getById(facilityId);

    // check owner have permission to update this facility
    if (facility.owner.id !== ownerId) {
      throw new NotAcceptableException(
        'You do not have permission to update this facility',
      );
    }

    // update facility
    if (updateFacilityDto.name) facility.name = updateFacilityDto.name;

    if (updateFacilityDto.description)
      facility.description = updateFacilityDto.description;

    if (updateFacilityDto.openTime && updateFacilityDto.closeTime) {
      isBefore(updateFacilityDto.openTime, updateFacilityDto.closeTime);

      facility.openTime = updateFacilityDto.openTime;
      facility.closeTime = updateFacilityDto.closeTime;
    }

    if (updateFacilityDto.location)
      facility.location = updateFacilityDto.location;

    try {
      await this.facilityRepository.save(facility);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Facility updated successfully',
    };
  }
}
