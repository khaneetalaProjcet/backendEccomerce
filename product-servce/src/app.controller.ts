import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() message: any, @Ctx() context: KafkaContext) {
    const offset = context.getMessage().offset;
    const partition = context.getPartition();
    console.log(`Received message on partition ${partition}, offset ${offset}`);
    console.log('Order data:', message.value);

    return offset
  }
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
