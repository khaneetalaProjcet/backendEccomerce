// src/rabbitmq/rabbitmq.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://localhost:5672');
    this.channel = await this.connection.createChannel();

    // Example: Declare multiple queues
    await this.channel.assertQueue('user_queue', { durable: true });
    await this.channel.assertQueue('order_queue', { durable: true });

    // Example: Consumer for user_queue
    this.channel.consume('user_queue', (msg) => {
      if (msg) {
        const content = msg.content.toString();
        console.log('Received in user_queue:', content);
        this.channel.ack(msg);
      }
    });

    // You can create more consumers here as needed
  }

  async sendToQueue(queue: string, message: any) {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
