import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PeopleService } from './providers/people.service';
import { GetPeopleByEmailDto } from './dtos/get-people-by-email.dto';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { ActivePeopleData } from 'src/auths/interfaces/active-people-data.interface';
import { RoleEnum } from 'src/auths/enums/role.enum';
import { Roles } from 'src/auths/decorators/role.decorator';

@Controller('people')
@UseInterceptors(ClassSerializerInterceptor)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @ApiOperation({
    summary: 'get all people',
  })
  @Roles(RoleEnum.ADMIN)
  @Get('all')
  public getAllPeople() {
    return this.peopleService.getAllPeople();
  }

  @ApiOperation({
    summary: 'get user by email',
  })
  @Get('/email')
  @Roles(RoleEnum.ADMIN)
  public getPeopleByEmail(@Body() getPeopleByEmailDto: GetPeopleByEmailDto) {
    return this.peopleService.getPeopleByEmail(getPeopleByEmailDto.email);
  }

  @Get('my-info')
  @Roles(RoleEnum.ADMIN, RoleEnum.OWNER, RoleEnum.PLAYER)
  public getMyInfor(@ActivePeople() activePeopleData: ActivePeopleData) {
    return this.peopleService.getMyInfo(activePeopleData);
  }
}
