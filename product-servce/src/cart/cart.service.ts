import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateItemCount } from '../cart/dto/updateItemCount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartInterface } from './entities/cart.entity';
import mongoose, { Model } from 'mongoose';
import {
  ProductItems,
  ProductItemsDocment,
} from 'src/product/entities/productItems.entity';
import { Product, ProductDocumnet } from 'src/product/entities/product.entity';
import { goldPriceService } from 'src/goldPrice/goldPrice.service';
import { log } from 'winston';

@Injectable()
export class CartService {
  constructor(
    private readonly goldPriceService: goldPriceService,
    @InjectModel(Cart.name) private cartModel: Model<CartInterface>,
    @InjectModel(ProductItems.name)
    private productItemsModel: Model<ProductItemsDocment>,
    @InjectModel(Product.name) private productModel: Model<ProductDocumnet>,
  ) {}

  async addToCart(userid: string, body: CreateCartDto) {
    try {
      // await this.cartModel.deleteMany()
      let item = await this.productItemsModel.findById(body.item);
      console.log('ffff', item);
      if (!item) {
        return {
          message: 'محصول مورد نظر یافت نشد',
          statusCode: 400,
          error: 'محصول مورد نظر یافت نشد',
        };
      }
      let product = await this.productModel.findOne({
        items: { $in: item._id },
      });
      console.log('22222', product);
      if (!product) {
        return {
          message: 'محصول مورد نظر یافت نشد',
          statusCode: 400,
          error: 'محصول مورد نظر یافت نشد',
        };
      }

      if (+body.count > +item.count) {
        return {
          message: 'تعداد درخواست شما بیشتر از موجودی محصول می باشد',
          statusCode: 400,
          error: 'تعداد درخواست شما بیشتر از موجودی محصول میباشد',
        };
      }

      console.log('ffff', item);
      let addCart = await this.cartModel.findOne({ user: userid });
      if (!addCart) {
        let newAddCard = await this.cartModel.create({
          user: userid,
          products: [],
          history: [],
        });
        addCart = await this.cartModel
          .findOne({ user: userid })
          .populate('products.product')
          .populate('products.mainProduct');
      }

      if (!addCart) {
        return {
          message: 'سبد مورد نظر یافت نشد',
          statusCode: 400,
          error: 'سبد مورد نظر یافت نشد',
        };
      }

      addCart.products.push({
        product: new mongoose.Types.ObjectId(item._id),
        mainProduct: new mongoose.Types.ObjectId(product._id),
        count: body.count,
      });

      let allCount = 0;
      if (addCart.products) {
        for (let i of addCart?.products) {
          allCount += +i.count;
        }
        addCart.count = allCount;
      }

      await addCart.save();
      let secondAdd = await this.cartModel
        .findOne({ user: userid })
        .populate('products.product')
        .populate('products.mainProduct');
      return {
        message: 'موفق',
        statusCode: 200,
        data: secondAdd,
      };
    } catch (error) {
      console.log('error occured >>> ', error);
      return {
        message: 'خطای داخلی سیستم',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }

  async updateCart(userId: string, body: UpdateItemCount) {
    console.log('its hereeeeee' , body)
    try {
      let item = await this.productItemsModel.findById(body.item);
      if (!item) {
        return {
          message: 'محصول مورد نظر یافت نشد',
          statusCode: 400,
          error: 'محصول مورد نظر یافت نشد',
        };
      }
      let product = await this.productModel.findOne({
        items: { $in: item._id },
      });


      console.log('22222', product);
      if (!product) {
        return {
          message: 'محصول مورد نظر یافت نشد',
          statusCode: 400,
          error: 'محصول مورد نظر یافت نشد',
        };
      }

      if (+body.count > +item.count) {
        return {
          message: 'تعداد درخواست شما بیشتر از موجودی محصول می باشد',
          statusCode: 400,
          error: 'تعداد درخواست شما بیشتر از موجودی محصول میباشد',
        };
      }

      let addCart = await this.cartModel
        .findOne({ user: userId })
        .populate('products.product')
        .populate('products.mainProduct');

      console.log('cart founded >>>> ' , addCart)
      
      if (!addCart) {
        return {
          message: '',
          statusCode: 400,
          error: '',
        };
      }

      // console.log(addCart , "////////");
      

      const productIndex = addCart.products.findIndex(
        (p) => p.product._id.toString() === item._id.toString(),
      );

      console.log(productIndex,"////// product index");
      

      if (productIndex === -1) {
        return {
          message: 'محصول در سبد خرید یافت نشد',
          statusCode: 400,
          error: 'ابتدا محصول را به سبد خرید اضافه کنید',
        };
      }

      if (+body.count < 1) {
        // Remove the product from the cart
        addCart.products.splice(productIndex, 1);
      } else {
        // Update the count
        addCart.products[productIndex].count = +body.count;
      }

      // Recalculate the total count
      let totalCount = 0;
      for (const p of addCart.products) {
        totalCount += +p.count;
      }
      addCart.count = totalCount;

      await addCart.save();
      console.log('acrt updated')
      return {
        message: 'سبد خرید بروزرسانی شد',
        statusCode: 200,
        data: addCart,
      };
    } catch (err) {
      console.log('error occured >>> ', err);
      return {
        message: 'خطای داخلی سیستم',
        statusCode: 500,
        error: 'خطای داخلی سیستم',
      };
    }
  }

  async getAllCarts(userId: string) {
    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('products.product')
      .populate('products.mainProduct');

    if (!cart) {
      cart = await this.cartModel.create({
        user: userId,
        products: [],
        history: [],
      });
    }

    const goldPrice = await this.goldPriceService.getGoldPrice(); // مثال: 3,200,000 تومان به‌ازای هر گرم طلا

    const itemPrices = this.calculateCartItemPrices(
      cart.products as any,
      goldPrice,
    );

    const enrichedProducts = cart.products.map((p, i) => ({
      ...JSON.parse(JSON.stringify(p)),
      pricing: itemPrices[i],
    }));

    const totalPrice = itemPrices.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    return {
      message: 'موفق',
      statusCode: 200,
      data: {
        ...JSON.parse(JSON.stringify(cart)),
        products: enrichedProducts,
        totalPrice,
      },
    };
  }

  private calculateCartItemPrices(
    cartProducts: {
      product: { weight: string | number };
      mainProduct: { wages: number };
      count: number;
    }[],
    goldPricePerGram: number,
  ): {
    unitPrice: number; // قیمت یک عدد
    totalPrice: number; // قیمت کل × تعداد
    count: number;
    weight: number;
    wagePercent: number;
    totalWeight: number;
  }[] {
    console.log('checkig fucking cart' , cartProducts)
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
}
