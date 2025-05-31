import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {KafkaProducerService} from "../src/kafka/kafka.producer"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly kafkaService:KafkaProducerService) {}

  @Get()
  async getHello() {
    await this.kafkaService.sendMessage('order_created', { orderId: '123', status: 'new' });
    return this.appService.getHello();
  }
}
