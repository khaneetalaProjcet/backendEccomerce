import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/entities/product.entity';
import { Category, CategorySchema } from 'src/category/entities/category.entity';
import { ProductItems, ProductItemSchema } from 'src/product/entities/productItems.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { JwtAdminStrategy } from 'src/jwt/admin-jwt.strategy';
import { LockerService } from 'src/locker/locker.service';
import { RedisServiceService } from 'src/redis-service/redis-service.service';
import { Cart, cartSchema } from './entities/cart.entity';
import { goldPriceService } from 'src/goldPrice/goldPrice.service';



@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema },
  { name: Category.name, schema: CategorySchema }, { name: Cart.name, schema: cartSchema }
    , { name: ProductItems.name, schema: ProductItemSchema }])],
  controllers: [CartController],
  providers: [CartService, JwtService,
    JwtStrategy,
    JwtAdminStrategy,
    LockerService,
    RedisServiceService,
   goldPriceService],
})

export class CartModule { }
