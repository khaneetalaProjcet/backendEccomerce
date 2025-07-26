import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService ) {}

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() message: any, @Ctx() context: KafkaContext) {
    const offset = context.getMessage().offset;
    const partition = context.getPartition();
    console.log(`Received message on partition ${partition}, offset ${offset}`);
    console.log('Order data:', message.value);

    return offset
  }
  
  @Get()
  async getHello() {
    
    console.log("here");

    // const rrr=await this.kafkaService.sendMessage('order_created', { orderId: '123', status: 'new',value:"salllll" });

    // console.log("rrr",rrr);
    
    return{
      message : 'موفق' , 
      statusCode : 200,
      data : "ss"
    }
  }
}
