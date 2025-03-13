import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { CreateServicesDto } from './dtos/create-services.dto';
import { ActivePeople } from 'src/auths/decorators/active-people.decorator';
import { ServiceService } from './service.service';
import { UpdateServiceDto } from './dtos/update-service.dto';

@Controller('service')
export class ServiceController {
  constructor(
    /**
     * inject service servce
     */
    private readonly serviceService: ServiceService,
  ) {}

  @ApiOperation({
    summary: 'Create many services (role: owner)',
  })
  @Post(':facilityId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public createMany(
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @Body() createServicesDto: CreateServicesDto,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.serviceService.createMany(
      createServicesDto,
      facilityId,
      ownerId,
    );
  }

  @ApiOperation({
    summary: 'Update service (role: owner)',
  })
  @Patch(':serviceId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public update(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.serviceService.update(updateServiceDto, serviceId, ownerId);
  }

  @ApiOperation({
    summary: 'Get services by facility (role: none)',
  })
  @ApiQuery({
    name: 'sportId',
    required: false,
    type: Number,
  })
  @Get(':facilityId')
  @AuthRoles(AuthRoleEnum.NONE)
  public getByfacility(
    @Param('facilityId', ParseUUIDPipe) facilityId: UUID,
    @Query('sportId', new ParseIntPipe({ optional: true })) sportId?: number,
  ) {
    return this.serviceService.getByFacility(facilityId, sportId);
  }

  @ApiOperation({
    summary: 'Delete service (role: owner)',
  })
  @Delete(':serviceId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public delete(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @ActivePeople('sub') ownerId: UUID,
  ) {
    return this.serviceService.delete(serviceId, ownerId);
  }
}
