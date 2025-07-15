import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartInterface } from 'src/cart/entities/cart.entity';
import { Mode } from 'fs';
import { Model } from 'mongoose';
import {
  ProductItems,
  ProductItemsDocment,
} from 'src/product/entities/productItems.entity';
import { Product, ProductDocumnet } from 'src/product/entities/product.entity';
import { Order, OrderInterface } from './entities/order.entity';
import { goldPriceService } from 'src/goldPrice/goldPrice.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly goldPriceService: goldPriceService,
    @InjectModel(Cart.name) private cartModel: Model<CartInterface>,
    @InjectModel(ProductItems.name)
    private productItemsModel: Model<ProductItemsDocment>,
    @InjectModel(Product.name) private productModel: Model<ProductDocumnet>,
    @InjectModel(Order.name) private orderModel: Model<OrderInterface>,
  ) {}


  async create(userId: string, body: any) {
    try {
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

      const cash: number = +body.cash;
      const goldPrice = await this.goldPriceService.getGoldPrice();
      const itemPrices = await this.calculateCartItemPrices(
        cart.products as any,
        +goldPrice,
      );
      const totalPrice = itemPrices.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );

      const now = new Date();
      const time = now.toTimeString().slice(0, 5);
      const date = now.toLocaleDateString('fa-IR');

      let goldBox = '0';

      // if (body.paymentMethod === 2) {
      //   goldBox = await this.caculateNumberOfGoldBox(
      //     ((totalPrice - cash) / +goldPrice).toString(),
      //   );
      // }

      if (body.paymentMethod === 2) {
        goldBox = await this.caculateNumberOfGoldBox(
          (totalPrice / +goldPrice).toString(),
        );
      }

      const order = await this.orderModel.create({
        user: userId,
        products: cart.products.map((p) => ({
          product: p.product._id,
          mainProduct: p.mainProduct._id,
          count: p.count,
        })),
        totalPrice,
        date,
        time,
        goldPrice,
        address: body.address,
        paymentMethod: body.paymentMethod,
        goldBox,
        goldBoxPay: 0,
        cashPay: 0,
      });

      const enrichedProducts = cart.products.map((p, i) => ({
        ...JSON.parse(JSON.stringify(p)),
        pricing: itemPrices[i],
      }));

      console.log('its finishsed' , enrichedProducts)
      return {
        message: '',
        statusCode: 200,
        data: { order, products: enrichedProducts },
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'مشکل داخلی سیسنم',
        statusCode: 500,
        error: 'مشکل داخلی سیسنم',
      };
    }
  }

  async findAllForUser(userId: string) {
    try {
      const orders = await this.orderModel.find({
          user: userId,
        }).populate('products.product').populate('products.mainProduct');

      const waitForPay = await this.orderModel.find({
        user : userId,
        status : 2
      }).populate('products.product').populate('products.mainProduct');
      
      const sent  = await this.orderModel.find({
        user : userId,
        status : 1,
      }).populate('products.product').populate('products.mainProduct');
      
      const canceled = await this.orderModel.find({
        user : userId,
        status : 5,
      }).populate('products.product').populate('products.mainProduct');
      
      const recived = await this.orderModel.find({
        user : userId,
        status : 4,
      }).populate('products.product').populate('products.mainProduct');
      

      let data = {
        orders,
        waitForPay,
        sent,
        canceled,
        recived,
      }

      return {
        message: '',
        statusCode: 200,
        data: data,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'مشکل داخلی سیسنم',
        statusCode: 500,
        error: 'مشکل داخلی سیسنم',
      };
    }
  }



  
  async allWaiting() {
    try {
      const sent  = await this.orderModel.find({
        status : 1,
      }).populate('products.product').populate('products.mainProduct');

      return {
        message: '',
        statusCode: 200,
        data: sent,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'مشکل داخلی سیسنم',
        statusCode: 500,
        error: 'مشکل داخلی سیسنم',
      };
    }
  }

  async findOneById(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);
      if (!order) {
        return {
          message: 'notFound',
          statusCode: 400,
          error: 'سفارش پیدا نشد',
        };
      }
      console.log('order', order);

      return {
        message: '',
        statusCode: 200,
        data: order,
      };
    } catch (error) {
      console.log('error', error);
      return {
        message: 'internalError',
        statusCode: 500,
        error: 'مشکل داخلی سیسنم',
      };
    }
  }

  async identityOrder(body: any) {
    try {
      console.log('req.body', body);
      const order = await this.orderModel.findById(body.orderId);
      if (!order) {
        return {
          message: 'سفارش پیدا نشد',
          statusCode: 400,
          error: 'سفارش پیدا نشد',
        };
      }
      order.status = 2;
      order.invoiceId = body.invoiceId;

      await order.save();

      console.log('order');

      return {
        message: '',
        statusCode: 200,
        data: order,
      };
    } catch (error) {
      console.log('error', error);

      return {
        message: 'مشکل داخلی سیسنم',
        statusCode: 500,
        error: 'مشکل داخلی سیسنم',
      };
    }
  }

  async getAllOrder() {
    try {
      const all = await this.orderModel
        .find()
        .populate('products.product')
        .populate('products.mainProduct');
      return {
        message: '',
        statusCode: 200,
        data: all,
      };
    } catch (err) {
      console.log('err');
      return {
        message: 'مشکل داخلی سیسنم',
        statusCode: 500,
        error: 'مشکل داخلی سیسنم',
      };
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

  async getGoldPrice() {
    const goldP = await this.goldPriceService.getGoldPrice();
    console.log('goldP', goldP);
    return {
      message: '',
      statusCode: 200,
      data: goldP,
    };
  }

  async updateOrderAfterPayment(orderId: string) {
    try {
      const order = await this.orderModel
        .findById(orderId)
        .populate('products.product');
      if (!order) {
        return {
          message: 'سفارش پیدا نشد',
          statusCode: 400,
          error: 'سفارش پیدا نشد',
        };
      }
      const items = order.products;
      for (let index = 0; index < items.length; index++) {
        const element = items[index];
        const productItem = await this.productItemsModel.findById(
          element.product._id,
        );
        if (!productItem) {
          break;
        }
        const remain = productItem.count - element.count;
        if (remain > 0) {
          break;
        }

        productItem.count = remain;

        await productItem.save();
      }

      order.status = 2;

      await order.save();

      return {
        message: '',
        statusCode: 200,
        data: order,
      };
    } catch (err) {
      console.log('err', err);
      return {
        message: 'مشکل داخلی سیسنم',
        statusCode: 500,
        error: 'مشکل داخلی سیسنم',
      };
    }
  }

  async updateOrder(orderId: string, status: string, invoice: any) {
    try {
      let order = await this.orderModel
        .findById(orderId)
        .populate('products.product');
      if (!order) {
        return {
          message: 'سفارش پیدا نشد',
          statusCode: 200,
          data: {
            code: 0,
          },
        };
      }
      if (+status == 1) {
        const items = order.products;
        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          const productItem = await this.productItemsModel.findById(
            element.product._id,
          );
          if (!productItem) {
            return {
              message: 'محصول یافت نشد',
              statusCode: 200,
              data: {
                code: 2,
              },
            };
          }

          const remain = productItem.count - element.count;
          if (remain < 0) {
            return {
              message: 'موجودی کافی نیست',
              statusCode: 200,
              data: {
                code: 2,
              },
            };
          }

          productItem.count = remain;

          await productItem.save();
        }

        order.status = 2;
        order.invoiceId = invoice._id;
        let cart = await this.cartModel.findOne({ user: order.user });
        if (!cart) {
          return {
            message: 'سبد خرید یافت نشد',
            statusCode: 200,
            data: {
              code: 2,
            },
          };
        }

        let cartItems = cart.products;
        let history = cart.history;
        for (let index = 0; index < cartItems.length; index++) {
          const element = cartItems[index];
          history.push(element);
        }

        cart.products = [];
        cart.history = history;
        await cart.save();
      } else {
        order.status = 3;
        order.invoiceId = invoice._id;
      }

      await order.save();
      return {
        message: '',
        statusCode: 200,
        data: {
          code: 1,
          order: order,
        },
      };
    } catch (err) {
      console.log('error');
      return {
        message: 'مشکل داخلی سیسنم',
        statusCode: 500,
        error: 'مشکل داخلی سیسنم',
        data: {
          code: 3,
        },
      };
    }
  }



  async updateAfterPayment(id : string , status : number , body : any){
    try {

      console.log('id >>>> ' , id , status , body)

      let order = await this.orderModel.findById(id)
      if (!order) {
        return {
          message: 'notFound',
          statusCode: 400,
        }
      }

      if (order.status != 2) {
        return {
          message: 'duplicateRequest',
          statusCode: 429,
        }
      }


      if (status == 0) {               // it means the payment failed
        if (order.paymentMethod == 1) {
          order.status = 5
          order.cashInvoiceId = body._id.toString()
          await order.save()
          return {
            message: 'done',
            statusCode: 200,
          }
        }

        if (order.paymentMethod == 2) {
          order.cashPay = 0;
          order.cashInvoiceId = body._id.toString()
          await order.save()
          return {
            message: 'done',
            statusCode: 200,
          }
        }
      }

      if (status == 1) {              // it means the payment successfully done
        if (order.paymentMethod == 1) {       // just cash
          order.status = 1;
          order.cashInvoiceId = body._id.toString()
          order.cashPay = 1;
          await order.save()
          return {
            message: 'done',
            statusCode: 200,
          }
        }

        if (order.paymentMethod == 2) {           // cash and goldBox
          order.cashPay = 1;
          order.cashInvoiceId = body._id.toString()
          await order.save()
          return {
            message: 'done',
            statusCode: 200,
          }
        }
      }
    } catch (error) {
      console.log('error occured in updating the order >>>> ')
      return {
        message: 'internal',
        statusCode: 500,
      }
    }
  }


  private async caculateNumberOfGoldBox(goldBox: string) {
    let seperator = goldBox.split('');

    let calculatedGoldBox = '';

    for (let i = 0; i < 5; i++) {
      calculatedGoldBox += i;
    }
    return calculatedGoldBox;
  }

  private async calculateCartItemPrices(
    cartProducts: {
      product: { weight: string | number };
      mainProduct: { wages: number };
      count: number;
    }[],
    goldPricePerGram: number,
  ): Promise<{
    unitPrice: number; // قیمت یک عدد
    totalPrice: number; // قیمت کل × تعداد
    count: number;
    weight: number;
    wagePercent: number;
    totalWeight: number;
  }[]> {
    return cartProducts.map((item) => {
      const weight =
        typeof item.product.weight === 'string'
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
        totalWeight,
      };
    });
  }

  async deletAll(){
      let all = await this.orderModel.deleteMany({})
      return {
        message : '',
        statusCode : 200,
      }
  }


}
