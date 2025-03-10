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
import { TestInterceptor } from './interceptors/test.interceptor';

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
  @UseInterceptors(FileInterceptor('image'))
  @AuthRoles(AuthRoleEnum.OWNER)
  public create(
    @Body() createFacilityDto: CreateFacilityDto,
    @UploadedFile() image: Express.Multer.File,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    console.log('🚀 ~ FacilityController ~ ownerId:', ownerId);
    console.log('🚀 ~ FacilityController ~ image:', image);
    console.log(
      '🚀 ~ FacilityController ~ createFacilityDto:',
      createFacilityDto,
    );
    // return this.facilityService.createFacility(createFacilityDto, ownerId);
  }

  @ApiOperation({
    summary: 'test get multipart file and json data',
  })
  @Post('/test')
  @AuthRoles(AuthRoleEnum.NONE)
  @UseInterceptors(FileInterceptor('image'), new TestInterceptor())
  public test(
    @Body('testDto') testDto: any,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log('🚀 ~ FacilityController ~ image:', image);
    console.log('🚀 ~ FacilityController ~ testDto:', testDto);

    return {
      message: 'see in the terminal',
    };
  }
}
