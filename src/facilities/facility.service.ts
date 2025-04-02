import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateFacilityDto } from './dtos/create-facility.dto';
import { DeleteImagesDto } from './dtos/delete-images.dto';
import { UpdateFacilityDto } from './dtos/update-facility.dto';
import { TransactionManagerProvider } from 'src/common/providers/transaction-manager.provider';
import { QueryRunner, Repository } from 'typeorm';
import { Facility } from './facility.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PersonService } from 'src/people/person.service';
import { FieldGroupService } from 'src/field-groups/field-group.service';
import { CertificateService } from 'src/certificates/certificate.service';
import { LicenseService } from 'src/licenses/license.service';

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
    /**
     * inject personService
     */
    private readonly personService: PersonService,
    /**
     * inject fieldGroupService
     */
    @Inject(forwardRef(() => FieldGroupService))
    private readonly fieldGroupService: FieldGroupService,
    /**
     * inject certificateService
     */
    @Inject(forwardRef(() => CertificateService))
    private readonly certificateService: CertificateService,
    /**
     * inject licenseService
     */
    private readonly licenseService: LicenseService,
  ) {}

  public async findOneById(facilityId: UUID, relations?: string[]) {
    const facility = await this.facilityRepository.findOne({
      where: {
        id: facilityId,
      },
      relations: relations,
    });

    if (!facility) {
      throw new NotFoundException('Facility not found');
    }

    return facility;
  }

  public async create(
    createFacilityDto: CreateFacilityDto,
    images: Express.Multer.File[],
    ownerId: UUID,
    certificate: Express.Multer.File,
    licenses?: Express.Multer.File[],
    sportIds?: number[],
  ) {
    // upload image to cloudinary
    const imagesUrl: string[] = [];
    for (const image of images) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { secure_url } = await this.cloudinaryService.uploadImage(image);
      imagesUrl.push(String(secure_url));
    }

    await this.transactionManagerProvider.transaction(
      async (queryRunner: QueryRunner) => {
        // get owner by id
        const owner = await this.personService.findOneByIdWithTransaction(
          ownerId,
          queryRunner,
        );

        // create new facility
        const facility = queryRunner.manager.create(Facility, {
          ...createFacilityDto,
          imagesUrl,
          owner,
        });

        await queryRunner.manager.save(facility);

        // create many field group
        for (const fieldGroupData of createFacilityDto.fieldGroups) {
          await this.fieldGroupService.createWithTransaction(
            fieldGroupData,
            facility,
            queryRunner,
          );
        }

        // create certificate
        await this.certificateService.createWithTransaction(
          certificate,
          facility,
          queryRunner,
        );

        // create many licenses
        if (sportIds && licenses) {
          if (sportIds.length !== licenses.length) {
            throw new BadRequestException(
              'sportIds and licenses must be the same length',
            );
          }

          // check sportIds is unique
          const uniqueSportIds = new Set(sportIds);
          if (uniqueSportIds.size !== sportIds.length) {
            throw new BadRequestException('sportIds must be unique');
          }

          // create many licenses
          for (let i = 0; i < licenses.length; i++) {
            await this.licenseService.createWithTransaction(
              licenses[i],
              facility,
              sportIds[i],
              queryRunner,
            );
          }
        }
      },
    );

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

  public async updateImages(
    images: Express.Multer.File[],
    facilityId: UUID,
    ownerId: UUID,
  ) {
    // get facility by id
    const faclity = await this.findOneById(facilityId);

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
    const facility = await this.findOneById(facilityId);

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
    const facility = await this.findOneById(facilityId);

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

    if (updateFacilityDto.openTime1) {
      facility.openTime1 = updateFacilityDto.openTime1;
    }

    if (updateFacilityDto.openTime2) {
      facility.openTime2 = updateFacilityDto.openTime2;
    }

    if (updateFacilityDto.openTime3) {
      facility.openTime3 = updateFacilityDto.openTime3;
    }

    if (updateFacilityDto.closeTime1) {
      facility.closeTime1 = updateFacilityDto.closeTime1;
    }

    if (updateFacilityDto.closeTime2) {
      facility.closeTime2 = updateFacilityDto.closeTime2;
    }

    if (updateFacilityDto.closeTime3) {
      facility.closeTime3 = updateFacilityDto.closeTime3;
    }

    try {
      await this.facilityRepository.save(facility);
    } catch (error) {
      throw new BadRequestException(String(error));
    }

    return {
      message: 'Facility updated successfully',
    };
  }

  public async getDropDownInfor(ownerId: UUID) {
    return await this.facilityRepository.find({
      select: {
        id: true,
        name: true,
      },
      where: {
        owner: {
          id: ownerId,
        },
      },
      order: {
        name: 'ASC',
      },
    });
  }

  public async getByOwner(ownerId: UUID) {
    const facilities = await this.facilityRepository.find({
      where: {
        owner: {
          id: ownerId,
        },
      },
      relations: {
        fieldGroups: {
          sports: true,
        },
      },
    });

    return facilities.map(({ fieldGroups, ...facility }) => ({
      ...facility,
      sports: fieldGroups
        .map((fieldGroup) => fieldGroup.sports)
        .flat()
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        ),
      minPrice: Math.min(
        ...fieldGroups.map((fieldGroup) => fieldGroup.basePrice),
      ),
      maxPrice: Math.max(
        ...fieldGroups.map((fieldGroup) => fieldGroup.basePrice),
      ),
    }));
  }
}
