import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, ValidationPipe, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateItemCount } from './dto/updateItemCount.dto';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}


  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createCart(@Req() req : any , @Res() res : any , @Body(new ValidationPipe()) body : CreateCartDto){
    let userId = req.user.userId  
    return this.cartService.addToCart(userId , body)
  }


  @Post('/update')
  @UseGuards(JwtAuthGuard)
  async updateCart(@Req() req : any , @Res() res : any , @Body(new ValidationPipe()) body : UpdateItemCount){
    let userId = req.user.userId  
    return this.cartService.updateCart(userId , body)
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUserCart(@Req() req : any , @Res() res : any ) {
    let userId = req.user.userId
    return this.cartService.getAllCarts(userId)
  }

  

}
