import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { GetPeopleByEmailDto } from './dtos/get-people-by-email.dto';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UUID } from 'crypto';

@Controller('people')
@UseInterceptors(ClassSerializerInterceptor)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @ApiOperation({
    summary: 'get all people (role: admin)',
  })
  @AuthRoles(AuthRoleEnum.ADMIN)
  @Get('all')
  public getAll() {
    return this.peopleService.getAll();
  }

  @ApiOperation({
    summary: 'get user by email (role: admin)',
  })
  @Get('/email')
  @AuthRoles(AuthRoleEnum.ADMIN)
  public getByEmail(@Body() getPeopleByEmailDto: GetPeopleByEmailDto) {
    return this.peopleService.getByEmail(getPeopleByEmailDto.email);
  }

  @ApiOperation({
    summary: 'get my info (role: admin, owner, player)',
  })
  @Get('my-info')
  @AuthRoles(AuthRoleEnum.ADMIN, AuthRoleEnum.OWNER, AuthRoleEnum.PLAYER)
  public getMyInfor(@ActivePeople('sub') peopleId: UUID) {
    return this.peopleService.getById(peopleId);
  }

  @ApiOperation({
    summary: 'update avatar (role: admin, owner, player)',
  })
  @Put('update-avatar')
  @AuthRoles(AuthRoleEnum.ADMIN, AuthRoleEnum.OWNER, AuthRoleEnum.PLAYER)
  @UseInterceptors(FileInterceptor('image'))
  public updateAvatar(
    @UploadedFile() image: Express.Multer.File,
    @ActivePeople('sub') peopleId: UUID,
  ) {
    return this.peopleService.updateAvatar(image, peopleId);
  }
}
