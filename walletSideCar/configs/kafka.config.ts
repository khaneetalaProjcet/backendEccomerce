// kafka/kafka.config.ts

import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConsumerConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'wallet-consumer', // must be unique
      brokers: ['127.0.0.1:9092'],
    },
    consumer: {
      groupId: 'user-group', // must be unique per app or scaled instance
    },
  },
};
