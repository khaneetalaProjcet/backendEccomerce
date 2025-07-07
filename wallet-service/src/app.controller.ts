import { Body, Controller, Get, Req, Res, Query, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
// import {
//   Ctx,
//   EventPattern,
//   KafkaContext,
//   Payload,
// } from '@nestjs/microservices';

@Controller('payment')
export class AppController {
  constructor(private readonly appService: AppService) { }



  @Post('callback')
  @HttpCode(HttpStatus.OK)
  async handleCallback(@Body() body: any) {
    const result = await this.appService.verifyTransactionCallback(body);
    return result;
  }
}
  // @EventPattern('order_created')
  // async handleOrderCreated(
  //   @Payload() message: any,
  //   @Ctx() context: KafkaContext,
  // ) {
  //   const offset = context.getMessage().offset;
  //   const partition = context.getPartition();
  //   console.log(`Received message on partition ${partition}, offset ${offset}`);
  //   console.log('Order data:', message.value);

  //   return offset;
  // }
  

  // @Post('/callback')
  // async handleCallback(@Body() body: any, @Res() res: Response) {
  //   const { RefNum, State, Status } = body;

  //   if (State !== 'OK') {
  //     // return res.status(400).send('تراکنش ناموفق بود');
  //   }

  //   const verified = await this.appService.verifyTransaction(RefNum);

  //   if (verified.verified) {
  //     await this.walletInvoiceModel.updateOne({ authority: RefNum }, {
  //       status: 'success',
  //       state: 2,
  //       rrn: verified.RRN,
  //       traceNo: verified.StraceNo,
  //       paymentDetail: verified,
  //     });

  //     // return res.send('پرداخت موفقیت‌آمیز بود');
  //   } else {
  //     // return res.status(400).send('تأیید تراکنش ناموفق بود');
  //   }
  // }

  // @Get("/redirect")
  // async redirectAfterGateway(@Req() req : any , @Res() res : any , @Body() body : any){
  //   return this.appService.redirectFromBehPardakht(body)
  // }

  //  @Get("/redirect/secondPayment")
  // async redirectAfterGatewayForGoldBox(@Req() req : any , @Res() res : any , @Body() body : any){
  //   return this.appService.redirectFromBehPardakhtForSecondPayment(body)
  // }

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

