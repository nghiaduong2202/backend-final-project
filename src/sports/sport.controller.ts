import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SportService } from './providers/sport.service';
import { CreateSportDto } from './dtos/create-sport.dto';
import { Roles } from 'src/auths/decorators/role.decorator';
import { RoleEnum } from 'src/auths/enums/role.enum';

@Controller('sport')
@UseInterceptors(ClassSerializerInterceptor)
export class SportController {
  constructor(
    /**
     * inject sport service
     */
    private readonly sportService: SportService,
  ) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  public create(@Body() createSportDto: CreateSportDto) {
    return this.sportService.createSport(createSportDto);
  }

  @Get('/all')
  @Roles(RoleEnum.NONE)
  public getAll() {
    return this.sportService.getAllSport();
  }
}
