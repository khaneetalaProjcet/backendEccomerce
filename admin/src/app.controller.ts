import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('user')
  @Get()
  getHello(@Payload() message: any) {
    // return this.appService.getHello();

    console.log('enent recieved in admin service', message);
  }
}
