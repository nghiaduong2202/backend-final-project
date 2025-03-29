import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdditionalServiceService } from './additional-service.service';
import { CreateAdditionalServiceDto } from './dto/create-additional-service.dto';
import { UpdateAdditionalServiceDto } from './dto/update-additional-service.dto';

@Controller('additional-service')
export class AdditionalServiceController {
  constructor(private readonly additionalServiceService: AdditionalServiceService) {}

  @Post()
  create(@Body() createAdditionalServiceDto: CreateAdditionalServiceDto) {
    return this.additionalServiceService.create(createAdditionalServiceDto);
  }

  @Get()
  findAll() {
    return this.additionalServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.additionalServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdditionalServiceDto: UpdateAdditionalServiceDto) {
    return this.additionalServiceService.update(+id, updateAdditionalServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.additionalServiceService.remove(+id);
  }
}
