import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { People } from '../people.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UpdateAvatarProvider {
  constructor(
    /**
     * inject cloudinary service
     */
    private readonly cloudinaryService: CloudinaryService,
    /**
     * inject people repository
     */
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {}

  public async updateAvatar(image: Express.Multer.File, peopleId: UUID) {
    const people = await this.peopleRepository.findOneBy({ id: peopleId });

    if (!people) {
      throw new NotFoundException('People not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { secure_url } = await this.cloudinaryService.uploadImage(image);

    if (secure_url === null)
      throw new BadRequestException('Avatar not uploaded');

    try {
      people.avatarUrl = String(secure_url);
      await this.peopleRepository.save(people);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return { message: 'Avatar updated successfully' };
  }
}
