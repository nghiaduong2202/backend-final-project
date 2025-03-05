import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './providers/people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';
import { CreateUserProvider } from './providers/create-user.provider';
import { RoleModule } from 'src/roles/role.module';
import { GetAllPeopleProvider } from './providers/get-all-people.provider';
import { GetPeopleByEmailProvider } from './providers/get-people-by-email.provider';
import { GetMyInfoProvider } from './providers/get-my-info.provider';
import { GetPeopleByIdProvider } from './providers/get-people-by-id.provider';

@Module({
  imports: [TypeOrmModule.forFeature([People]), RoleModule],
  controllers: [PeopleController],
  providers: [
    PeopleService,
    CreateUserProvider,
    GetAllPeopleProvider,
    GetPeopleByEmailProvider,
    GetMyInfoProvider,
    GetPeopleByIdProvider,
  ],
  exports: [PeopleService],
})
export class PeopleModule {}
