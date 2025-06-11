import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("create")
  @UseGuards(JwtAuthGuard)
  create(@Req() req : any , @Res() res : any) {
    const userId=req.user.userId
    return this.orderService.create(userId);
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
