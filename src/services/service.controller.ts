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
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { CreateManyServicesDto } from './dtos/create-many-services.dto';
import { ActivePerson } from 'src/auths/decorators/active-person.decorator';
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
  @Post()
  @AuthRoles(AuthRoleEnum.OWNER)
  public createMany(
    @Body() createManyServicesDto: CreateManyServicesDto,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.serviceService.createMany(createManyServicesDto, ownerId);
  }

  @ApiOperation({
    summary: 'Update service (role: owner)',
  })
  @Patch(':serviceId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public update(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.serviceService.update(updateServiceDto, serviceId, ownerId);
  }

  @ApiOperation({
    summary: 'Get services by facility (role: none)',
  })
  @Get(':facilityId')
  @AuthRoles(AuthRoleEnum.NONE)
  public getByfacility(@Param('facilityId', ParseUUIDPipe) facilityId: UUID) {
    return this.serviceService.getByFacility(facilityId);
  }

  @ApiOperation({
    summary: 'Delete service (role: owner)',
  })
  @Delete(':serviceId')
  @AuthRoles(AuthRoleEnum.OWNER)
  public delete(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @ActivePerson('sub') ownerId: UUID,
  ) {
    return this.serviceService.delete(serviceId, ownerId);
  }
}
