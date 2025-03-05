import { Module } from '@nestjs/common';
import { SportController } from './sport.controller';
import { SportService } from './providers/sport.service';
import { CreateSportProvider } from './providers/create-sport.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from './sport.entity';
import { GetAllSportProvider } from './providers/get-all-sport.provider';
import { GetSportByIdsProvider } from './providers/get-sport-by-ids.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  controllers: [SportController],
  providers: [
    SportService,
    CreateSportProvider,
    GetAllSportProvider,
    GetSportByIdsProvider,
  ],
  exports: [SportService],
})
export class SportModule {}
