import { Body, Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';



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


  @Get("/redirect")
  async redirectAfterGateway(@Req() req : any , @Res() res : any , @Body() body : any){
    return 
  }




  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
