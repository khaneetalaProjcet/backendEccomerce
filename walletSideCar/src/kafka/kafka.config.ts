import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConsumerConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'wallet-consumer', 
      brokers: ['127.0.0.1:9092'],
    },
    consumer: {
      groupId: 'wallet-group',
    },
  },
};
