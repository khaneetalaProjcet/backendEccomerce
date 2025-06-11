import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/entities/product.entity';
import { ProductItems, ProductItemSchema } from 'src/product/entities/productItems.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { JwtAdminStrategy } from 'src/jwt/admin-jwt.strategy';
import { LockerService } from 'src/locker/locker.service';
import { RedisServiceService } from 'src/redis-service/redis-service.service';
import { Cart, cartSchema } from '../cart/entities/cart.entity';
import { Order, orderSchema } from './entities/order.entity';
import { OrderService } from './order.service';
import { goldPriceService } from 'src/goldPrice/goldPrice.service';



@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema },
  { name: Order.name, schema: orderSchema }, { name: Cart.name, schema: cartSchema }
  , { name: ProductItems.name, schema: ProductItemSchema }])],
  controllers: [OrderController],
  providers: [JwtService,
    JwtStrategy,
    JwtAdminStrategy,
    LockerService,
    RedisServiceService,
    OrderService,goldPriceService],
})

export class OrderModule {}
