import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SportService } from './sport.service';
import { CreateSportDto } from './dtos/create-sport.dto';
import { AuthRoles } from 'src/auths/decorators/auth-role.decorator';
import { AuthRoleEnum } from 'src/auths/enums/auth-role.enum';
import { ApiOperation } from '@nestjs/swagger';

@Controller('sport')
@UseInterceptors(ClassSerializerInterceptor)
export class SportController {
  constructor(
    /**
     * inject sport service
     */
    private readonly sportService: SportService,
  ) {}

  @ApiOperation({
    summary: 'create sport (role: admin)',
  })
  @Post()
  @AuthRoles(AuthRoleEnum.ADMIN)
  public create(@Body() createSportDto: CreateSportDto) {
    return this.sportService.createSport(createSportDto);
  }

  @ApiOperation({
    summary: 'get all sport (role: none)',
  })
  @Get('/all')
  @AuthRoles(AuthRoleEnum.NONE)
  public getAll() {
    return this.sportService.getAllSport();
  }
}
