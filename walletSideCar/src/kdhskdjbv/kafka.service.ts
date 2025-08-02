import { Injectable } from '@nestjs/common';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { kafkaConsumerConfig } from 'configs/kafka.config';
import { Kafka } from 'kafkajs';



@Injectable()
export class KafkaService {

    

    async onModuleInit() {
        await this.producer.connect();
        console.log('Kafka Producer connected');
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
        console.log('Kafka Producer disconnected');
    }


    private kafka = new Kafka({
        clientId: kafkaConsumerConfig.options?.client?.clientId || 'wallet-consumer',
        brokers: kafkaConsumerConfig.options?.client?.brokers || ["127.0.0.1:9092"],
    });

    private producer = this.kafka.producer();

    async sendMessage(topic: string, message: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }
}
