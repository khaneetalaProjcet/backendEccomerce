import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { JwtAdminAuthGuard } from '../jwt/admin-jwt-auth.guard';
import {
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern('wallet')
  @Get()
  testkafka(@Payload() message: any) {
    console.log('event received in order controller', message);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateOrderDto })
  create(@Req() req: any, @Res() res: any, @Body() body: CreateOrderDto) {
    const userId = req.user.userId;
    return this.orderService.create(userId, body);
  }
  @Get('admin/orders')
  @UseGuards(JwtAdminAuthGuard)
  findAllOrderAdmin(
    @Req() req: any,
    @Res() res: any,
    @Query('search') search: string,
  ) {
    return this.orderService.getAllOrder(search);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any, @Res() res: any) {
    const userId = req.user.userId;
    return this.orderService.findAllForUser(userId);
  }

  @Get('waiting')
  @UseGuards(JwtAdminAuthGuard)
  allWaiting(@Req() req: any, @Res() res: any, @Query() query: string) {
    return this.orderService.allWaiting(query);
  }

  @Get('price')
  goldPrice(@Req() req: any, @Res() res: any) {
    return this.orderService.getGoldPrice();
  }

  @Get('internal/findone/:id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOneById(id);
  }

  @Post('internal/identity')
  identity(@Body() body: any) {
    return this.orderService.identityOrder(body);
  }

  @Get('internal/afterpay/:id')
  updateAfterPayment(@Param('id') id: string) {
    return this.orderService.updateOrderAfterPayment(id);
  }
  @Post('internal/update/:id/:status')
  update(
    @Param('id') id: string,
    @Param('status') status: string,
    @Body() body: any,
  ) {
    return this.orderService.updateOrder(id, status, body);
  }
  @Post('internal/update/payment/:id/:status')
  payment(
    @Param('id') id: string,
    @Param('status') status: string,
    @Body() body: any,
  ) {
    return this.orderService.updateAfterPayment(id, +status, body);
  }

  @ApiTags('Order')
  @Patch('confirm-delivery/:id')
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({
    summary: 'Confirm delivery of an order',
    description:
      'Changes the order status from "pending for payment" (status = 2) to "received" (status = 4). Only works if current status is 2.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'order id ',
  })
  @ApiResponse({
    status: 200,
    description: 'Order status successfully updated to received.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid order status or order not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal service error',
    schema: {
      example: {
        success: false,
        message: 'internal error',
        error: 'internal service error',
        data: null,
      },
    },
  })
  @Patch('confirm-delivery/:id')
  @UseGuards(JwtAdminAuthGuard)
  confirmDelivery(@Param('id') id: string) {
    return this.orderService.confirmDelivery(id);
  }

  @Get('delall')
  delAll() {
    return this.orderService.deletAll();
  }

  @Get('/order-by-status')
  OrdersCountByStatus() {
    return this.orderService.getOrdersCountByStatus();
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
