import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { ApiBody } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateOrderDto })
  create(@Req() req : any , @Res() res : any,@Body() body:CreateOrderDto) {
    const userId=req.user.userId
    return this.orderService.create(userId,body);
  }

  @Get("user")
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req : any , @Res() res : any) {
    const userId=req.user.userId
    return this.orderService.findAllForUser(userId);
  }

  @Get("price")
  goldPrice(@Req() req : any , @Res() res : any) {
    return this.orderService.getGoldPrice();
  }

  @Get("internal/findone/:id")
  findOne(@Param('id') id: string) {
    return this.orderService.findOneById(id);
  }


  @Post("internal/identity")
  identity(@Body() body:any){
    return this.orderService.identityOrder(body)
  }afterpay

   @Get("internal/afterpay/:id")
   updateAfterPayment(@Param('id') id: string) {
    return this.orderService.updateOrderAfterPayment(id);
  }
  @Get("internal/update/:id/:status")
   update(@Param('id') id: string,@Param('status') status: string,@Body() body:any) {
    return this.orderService.updateOrder(id,status,body);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.orderService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orderService.remove(+id);
  // }
}
