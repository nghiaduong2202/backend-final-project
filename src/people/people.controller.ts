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
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';

@Controller('people')
@UseInterceptors(ClassSerializerInterceptor)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @ApiOperation({
    summary: 'get all people',
  })
  @AuthRoles(AuthRoleEnum.ADMIN)
  @Get('all')
  public getAllPeople() {
    return this.peopleService.getAllPeople();
  }

  @ApiOperation({
    summary: 'get user by email',
  })
  @Get('/email')
  @AuthRoles(AuthRoleEnum.ADMIN)
  public getPeopleByEmail(@Body() getPeopleByEmailDto: GetPeopleByEmailDto) {
    return this.peopleService.getPeopleByEmail(getPeopleByEmailDto.email);
  }

  @Get('my-info')
  @AuthRoles(AuthRoleEnum.ADMIN, AuthRoleEnum.OWNER, AuthRoleEnum.PLAYER)
  public getMyInfor(@ActivePeople() activePeopleData: ActivePeopleData) {
    return this.peopleService.getMyInfo(activePeopleData);
  }
}
