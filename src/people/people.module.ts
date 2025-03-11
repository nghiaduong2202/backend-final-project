import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';
import { CreateProvider } from './providers/create.provider';
import { GetAllProvider } from './providers/get-all.provider';
import { GetByEmailProvider } from './providers/get-by-email.provider';
import { GetByIdProvider } from './providers/get-by-id.provider';
import { UpdateAvatarProvider } from './providers/update-avatar.provider';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([People]), CloudinaryModule],
  controllers: [PeopleController],
  providers: [
    PeopleService,
    CreateProvider,
    GetAllProvider,
    GetByEmailProvider,
    GetByIdProvider,
    UpdateAvatarProvider,
  ],
  exports: [PeopleService],
})
export class PeopleModule {}
