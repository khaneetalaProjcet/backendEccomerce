import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartInterface } from 'src/cart/entities/cart.entity';
import { Mode } from 'fs';
import { Model } from 'mongoose';
import { ProductItems, ProductItemsDocment } from 'src/product/entities/productItems.entity';
import { Product, ProductDocumnet } from 'src/product/entities/product.entity';
import { Order, OrderInterface } from './entities/order.entity';

@Injectable()
export class OrderService {
   constructor(
      @InjectModel(Cart.name) private cartModel: Model<CartInterface>,
      @InjectModel(ProductItems.name) private productItemsModel: Model<ProductItemsDocment>,
      @InjectModel(Product.name) private productModel: Model<ProductDocumnet>,
      @InjectModel(Order.name) private orderModel : Model<OrderInterface>
    ) { }
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
