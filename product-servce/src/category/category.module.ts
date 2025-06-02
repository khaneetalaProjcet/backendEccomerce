import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { JwtAdminStrategy } from 'src/jwt/admin-jwt.strategy';

@Module({
  imports:[MongooseModule.forFeature([ { name: Category.name, schema: CategorySchema }])],
  controllers: [CategoryController],
  providers: [CategoryService,JwtService,JwtStrategy,JwtAdminStrategy],
})
export class CategoryModule {}
