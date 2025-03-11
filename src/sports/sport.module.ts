import { Module } from '@nestjs/common';
import { SportController } from './sport.controller';
import { SportService } from './sport.service';
import { CreateProvider } from './providers/create.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from './sport.entity';
import { GetAllProvider } from './providers/get-all.provider';
import { GetByIdProvider } from './providers/get-by-id.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  controllers: [SportController],
  providers: [SportService, CreateProvider, GetAllProvider, GetByIdProvider],
  exports: [SportService],
})
export class SportModule {}
