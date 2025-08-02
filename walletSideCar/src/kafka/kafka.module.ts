import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';
import { KafkaProducerService } from './kafka.poducer';

@Module({
  controllers: [KafkaController],
  providers: [KafkaService, KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
