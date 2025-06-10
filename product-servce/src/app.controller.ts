import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {KafkaProducerService} from "../src/kafka/kafka.producer"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService , private readonly kafkaService:KafkaProducerService ) {}

  // @EventPattern('order_created')
  // async handleOrderCreated(@Payload() message: any, @Ctx() context: KafkaContext) {
  //   const offset = context.getMessage().offset;
  //   const partition = context.getPartition();
  //   console.log(`Received message on partition ${partition}, offset ${offset}`);
  //   console.log('Order data:', message.value);

  //   return offset
  // }
  
  @Get()
  async getHello() {
    await this.kafkaService.sendMessage('order_created', { orderId: '123', status: 'new',value:"salllll" });
    return this.appService.getHello();
  }
}
