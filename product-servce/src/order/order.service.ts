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
  async create(userId:string) {
    try{
        const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('products.product')
      .populate('products.mainProduct');

    if (!cart || cart.products.length === 0) {
      return {
        statusCode: 400,
        message: 'سبد خرید شما خالی است',
      };
    }

    const goldPrice = 6000000; // could be dynamic
    const itemPrices =this.calculateCartItemPrices(cart.products as any, goldPrice);
    const totalPrice = itemPrices.reduce((sum, item) => sum + item.totalPrice, 0);

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const date = now.toLocaleDateString('fa-IR');

    const order = await this.orderModel.create({
      user: userId,
      products: cart.products.map(p => ({
        product: p.product._id,
        mainProduct: p.mainProduct._id,
        count: p.count,
      })),
      totalPrice,
      date,
      time,
      goldPrice
    });
    const enrichedProducts = cart.products.map((p, i) => ({
    ...JSON.parse(JSON.stringify(p)),
    pricing: itemPrices[i]
  }));
    return {
        message: '',
        statusCode: 200,
        data:{order,products:enrichedProducts}
    };
    }catch(error){
      console.log(error);   
      return {
          message: 'مشکل داخلی سیسنم',
          statusCode: 500,
          error: 'مشکل داخلی سیسنم'
        }
  }
   
  }

  async findAllForUser(userId : string) {
    try{
       const orders=await this.orderModel.find({
      user:userId
    })
    .populate('products.product')
    .populate('products.mainProduct');
    return {
        message: '',
        statusCode: 200,
        data:orders
    }
    }catch(error){
      console.log(error);   
      return {
          message: 'مشکل داخلی سیسنم',
          statusCode: 500,
          error: 'مشکل داخلی سیسنم'
        }
    }
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


  private calculateCartItemPrices(
  cartProducts: {
    product: { weight: string | number };
    mainProduct: { wages: number };
    count: number;
  }[],
  goldPricePerGram: number
): {
  unitPrice: number;     // قیمت یک عدد
  totalPrice: number;    // قیمت کل × تعداد
  count: number;
  weight: number;
  wagePercent: number;
  totalWeight: number;
}[] {
  return cartProducts.map(item => {
    const weight = typeof item.product.weight === 'string'
      ? parseFloat(item.product.weight)
      : item.product.weight;

    const wagePercent = item.mainProduct.wages;
    const wageGrams = weight * (wagePercent / 100);
    const totalWeight = weight + wageGrams;

    const unitPrice = totalWeight * goldPricePerGram;
    const totalPrice = unitPrice * item.count;

    return {
      unitPrice,
      totalPrice,
      count: item.count,
      weight,
      wagePercent,
      totalWeight
    };
  });
  }
}
