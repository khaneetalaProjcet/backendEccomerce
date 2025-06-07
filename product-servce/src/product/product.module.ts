import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { JwtAdminStrategy } from 'src/jwt/admin-jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { ProductItems,ProductItemSchema } from './entities/productItems.entity';
import { LockerService } from 'src/locker/locker.service';
import { RedisServiceService } from 'src/redis-service/redis-service.service';

@Module({
  imports:[MongooseModule.forFeature([ { name: Product.name, schema: ProductSchema }
  ,{name:ProductItems.name,schema:ProductItemSchema}])],
  controllers: [ProductController],
  providers: [ProductService,JwtService,JwtStrategy,JwtAdminStrategy,LockerService,RedisServiceService],
})
export class ProductModule {}
