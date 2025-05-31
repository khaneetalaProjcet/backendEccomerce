import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { kafkaConsumerConfig } from './kafka.config';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka = new Kafka({
    clientId:kafkaConsumerConfig.options?.client?.clientId || 'product-consumer',
    brokers:kafkaConsumerConfig.options?.client?.brokers || ["127.0.0.1:9092"] ,
  });

  private producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
    console.log('Kafka Producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('Kafka Producer disconnected');
  }

  async sendMessage(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
