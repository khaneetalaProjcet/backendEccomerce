// kafka/kafka.module.ts
import { Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer';

@Module({
  providers: [KafkaProducerService],
  exports: [KafkaProducerService], // So other modules can inject it
})
export class KafkaModule {}
