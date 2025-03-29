import { Module } from '@nestjs/common';
import { AdditionalServiceService } from './additional-service.service';
import { AdditionalServiceController } from './additional-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdditionalService } from './additional-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdditionalService])],
  controllers: [AdditionalServiceController],
  providers: [AdditionalServiceService],
})
export class AdditionalServiceModule {}
