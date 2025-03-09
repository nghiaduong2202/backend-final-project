import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { CreateFacilityDto } from './dtos/create-facility.dto';
import { FacilityService } from './facility.service';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { UUID } from 'crypto';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestDto } from './dtos/test.dto';

@Controller('facility')
@UseInterceptors(ClassSerializerInterceptor)
export class FacilityController {
  constructor(
    /**
     * inject facility service
     */
    private readonly facilityService: FacilityService,
  ) {}

  @ApiOperation({
    summary: 'create new facility and field groups and fields (role: owner)',
  })
  @Post('')
  @AuthRoles(AuthRoleEnum.OWNER)
  public create(
    @Body() createFacilityDto: CreateFacilityDto,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.facilityService.createFacility(createFacilityDto, ownerId);
  }

  @ApiOperation({
    summary: 'test get multipart file and json data',
  })
  @Post('/test')
  @AuthRoles(AuthRoleEnum.NONE)
  @UseInterceptors(FileInterceptor('image'))
  public test(
    @Body('testDto') testDto: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: TestDto = JSON.parse(testDto);
    console.log('🚀 ~ FacilityController ~ testDto:', typeof data);

    console.log('🚀 ~ FacilityController ~ image:', image);

    return {
      message: 'see in the terminal',
    };
  }
}
