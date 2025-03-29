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
import { PersonService } from './person.service';
import { GetPersonByEmailDto } from './dtos/get-person-by-email.dto';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UUID } from 'crypto';

@Controller('person')
@UseInterceptors(ClassSerializerInterceptor)
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @ApiOperation({
    summary: 'get all person (role: admin)',
  })
  @AuthRoles(AuthRoleEnum.ADMIN)
  @Get('all')
  public getAll() {
    return this.personService.getAll();
  }

  @ApiOperation({
    summary: 'get user by email (role: admin)',
  })
  @Get('/email')
  @AuthRoles(AuthRoleEnum.ADMIN)
  public getByEmail(@Body() getPersonByEmailDto: GetPersonByEmailDto) {
    return this.personService.getByEmail(getPersonByEmailDto.email);
  }

  @ApiOperation({
    summary: 'get my info (role: admin, owner, player)',
  })
  @Get('my-info')
  @AuthRoles(AuthRoleEnum.ADMIN, AuthRoleEnum.OWNER, AuthRoleEnum.PLAYER)
  public getMyInfor(@ActivePerson('sub') personId: UUID) {
    return this.personService.getById(personId);
  }

  @ApiOperation({
    summary: 'update avatar (role: admin, owner, player)',
  })
  @Put('update-avatar')
  @AuthRoles(AuthRoleEnum.ADMIN, AuthRoleEnum.OWNER, AuthRoleEnum.PLAYER)
  @UseInterceptors(FileInterceptor('image'))
  public updateAvatar(
    @UploadedFile() image: Express.Multer.File,
    @ActivePerson('sub') personId: UUID,
  ) {
    return this.personService.updateAvatar(image, personId);
  }
}
