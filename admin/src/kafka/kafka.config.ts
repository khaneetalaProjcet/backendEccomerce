// // kafka/kafka.config.ts

// import { KafkaOptions, Transport } from '@nestjs/microservices';

// export const kafkaConsumerConfig: KafkaOptions = {
//   transport: Transport.KAFKA,
//   options: {
//     client: {
//       clientId: 'admin-consumer', // must be unique
//       brokers: ['127.0.0.1:9092'],
//     },
//     consumer: {
//       groupId: 'admin-group', // must be unique per app or scaled instance
//     },
//   },
// };
