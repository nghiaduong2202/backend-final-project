import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { CreateFacilityDto } from '../dtos/create-facility.dto';
import { Facility } from '../facility.entity';
import { FieldGroup } from 'src/field-groups/field-group.entity';
import { Field } from 'src/fields/field.entity';
import { PeopleService } from 'src/people/people.service';
import { UUID } from 'crypto';
import { CreateFieldGroupDto } from 'src/field-groups/dtos/create-field-group.dto';
import { CreateFieldDto } from 'src/fields/dtos/create-field.dto';
import { SportService } from 'src/sports/sport.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CreateProvider {
  constructor(
    /**
     * inject data source
     */
    private readonly dataSource: DataSource,
    /**
     * inject people service
     */
    private readonly peopleService: PeopleService,
    /**
     * inject sport service
     */
    private readonly sportService: SportService,
    /**
     * inject cloudinary service
     */
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async create(
    createFacilityDto: CreateFacilityDto,
    images: Express.Multer.File[],
    ownerId: UUID,
  ) {
    const owner = await this.peopleService.getById(ownerId);

    const imagesUrl: string[] = [];

    for (const image of images) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { secure_url } = await this.cloudinaryService.uploadImage(image);
      imagesUrl.push(String(secure_url));
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      /**
       * create new facility
       */
      const facility = queryRunner.manager.create(Facility, {
        ...createFacilityDto,
        imagesUrl,
        owner,
      });

      await queryRunner.manager.save(facility);

      const fieldGroupsData = createFacilityDto.fieldGroupsData;

      /**
       * create field groups in to facility
       */
      for (const fieldGroupData of fieldGroupsData) {
        const fieldGroup = await this.createFieldGroup(
          fieldGroupData,
          facility,
          queryRunner,
        );

        /**
         * create fields in field group
         */
        const fieldsData = fieldGroupData.fieldsData;

        for (const fieldData of fieldsData) {
          await this.createField(fieldData, fieldGroup, queryRunner);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error create new facility', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }

    return {
      message: 'Create new facility successful',
    };
  }

  private async createFieldGroup(
    createFieldGroupDto: CreateFieldGroupDto,
    facility: Facility,
    queryRunner: QueryRunner,
  ) {
    const sports = await this.sportService.getByManyId(
      createFieldGroupDto.sportIds,
    );

    const fieldGroup = queryRunner.manager.create(FieldGroup, {
      ...createFieldGroupDto,
      sports,
      facility,
    });

    await queryRunner.manager.save(fieldGroup);

    return fieldGroup;
  }

  private async createField(
    createFieldDto: CreateFieldDto,
    fieldGroup: FieldGroup,
    queryRunner: QueryRunner,
  ) {
    // const fieldGroup =
    //   await this.fieldGroupService.getFieldGroupById(fieldGroupId);

    const newField = queryRunner.manager.create(Field, {
      ...createFieldDto,
      fieldGroup,
    });

    await queryRunner.manager.save(newField);

    return newField;
  }
}
