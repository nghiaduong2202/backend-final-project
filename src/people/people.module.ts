import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';
import { CreateUserProvider } from './providers/create-user.provider';
import { GetAllPeopleProvider } from './providers/get-all-people.provider';
import { GetPeopleByEmailProvider } from './providers/get-people-by-email.provider';
import { GetMyInfoProvider } from './providers/get-my-info.provider';
import { GetPeopleByIdProvider } from './providers/get-people-by-id.provider';
import { UpdateAvatarProvider } from './providers/update-avatar.provider';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([People]), CloudinaryModule],
  controllers: [PeopleController],
  providers: [
    PeopleService,
    CreateUserProvider,
    GetAllPeopleProvider,
    GetPeopleByEmailProvider,
    GetMyInfoProvider,
    GetPeopleByIdProvider,
    UpdateAvatarProvider,
  ],
  exports: [PeopleService],
})
export class PeopleModule {}
