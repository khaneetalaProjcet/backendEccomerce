import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {UpdateItemCount} from "../cart/dto/updateItemCount.dto"
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartInterface } from './entities/cart.entity';
import mongoose, { Model } from 'mongoose';
import { ProductItems, ProductItemsDocment } from 'src/product/entities/productItems.entity';
import { Product, ProductDocumnet } from 'src/product/entities/product.entity';

@Injectable()
export class CartService {

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartInterface>,
    @InjectModel(ProductItems.name) private productItemsModel: Model<ProductItemsDocment>,
    @InjectModel(Product.name) private productModel: Model<ProductDocumnet>,
  ) { }


  async addToCart(userid: string, body: CreateCartDto) {
    try {
      // await this.cartModel.deleteMany()
      let item = await this.productItemsModel.findById(body.item)
      console.log( 'ffff', item)
      if (!item) {
        return {
          message: 'محصول مورد نظر یافت نشد',
          statusCode: 400,
          error: 'محصول مورد نظر یافت نشد'
        }
      }
      let product = await this.productModel.findOne({
      items : {$in:item._id}
      })
      console.log( '22222', product)
      if (!product) {
        return {
          message: 'محصول مورد نظر یافت نشد',
          statusCode: 400,
          error: 'محصول مورد نظر یافت نشد'
        }
      }

      if (+body.count > +item.count) {
        return {
          message: 'تعداد درخواست شما بیشتر از موجودی محصول می باشد',
          statusCode: 400,
          error: 'تعداد درخواست شما بیشتر از موجودی محصول میباشد'
        }
      }

      let addCart = await this.cartModel.findOne({ user: userid })
      if (!addCart) {
        let newAddCard = await this.cartModel.create({
          user: userid,
          products: [],
          history: []
        })
        addCart = await this.cartModel.findOne({ user: userid })
      }


  
      if(!addCart){
        return {
            message: 'سبد مورد نظر یافت نشد',
            statusCode: 400,
            error: 'سبد مورد نظر یافت نشد' 
        }
      }
      

      addCart.products.push({
        product : new mongoose.Types.ObjectId(item._id),
        mainProduct : new mongoose.Types.ObjectId(product._id),
        count : body.count
      })
      

      let allCount = 0
      if (addCart.products){
        for (let i of addCart?.products){
            allCount += +i.count
        }
        addCart.count = allCount
      }
      
 
     await addCart.save()

      return {
        message: 'موفق',
        statusCode: 200,
        data: addCart
      }
    } catch (error) {
      console.log('error occured >>> ', error)
      return {
        message: 'خطای داخلی سیستم',
        statusCode: 500,
        error: 'خطای داخلی سیستم'
      }
    }
  }


  async updateCart(userId:string,body:UpdateItemCount){
    try{
       let item = await this.productItemsModel.findById(body.item)
      console.log( 'ffff', item)
      if (!item) {
        return {
          message: 'محصول مورد نظر یافت نشد',
          statusCode: 400,
          error: 'محصول مورد نظر یافت نشد'
        }
      }
      let product = await this.productModel.findOne({
      items : {$in:item._id}
      })
      console.log( '22222', product)
      if (!product) {
        return {
          message: 'محصول مورد نظر یافت نشد',
          statusCode: 400,
          error: 'محصول مورد نظر یافت نشد'
        }
      }

      if (+body.count > +item.count) {
        return {
          message: 'تعداد درخواست شما بیشتر از موجودی محصول می باشد',
          statusCode: 400,
          error: 'تعداد درخواست شما بیشتر از موجودی محصول میباشد'
        }
      }

      let addCart = await this.cartModel.findOne({ user: userId })
      if(!addCart){
        return {
           message: '',
          statusCode: 400,
          error: ''
        }
      }

      const productIndex = addCart.products.findIndex(p =>
      p.product.toString() === item._id.toString()
    );

    if (productIndex === -1) {
      return {
        message: 'محصول در سبد خرید یافت نشد',
        statusCode: 400,
        error: 'ابتدا محصول را به سبد خرید اضافه کنید'
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


    return {
      message: 'سبد خرید بروزرسانی شد',
      statusCode: 200,
      data: addCart
    };
    }catch(err){
        console.log('error occured >>> ', err)
      return {
        message: 'خطای داخلی سیستم',
        statusCode: 500,
        error: 'خطای داخلی سیستم'
      }
    }
  }

  async getAllCarts(userId : string){
    let cart = await this.cartModel.findOne({user : userId}).populate( 'products.product' ).populate('products.mainProduct')
    if (!cart){
      cart = await this.cartModel.create({
        user : userId,
        products : [],
        history : []
      })
    }

    const goldPrice=6000000

    const totalPrice=this.calculateCartTotalPrice(cart.products as any,goldPrice)

    console.log(totalPrice);
    
 
    cart.totalPrice=totalPrice
    await cart.save();

    return {
      message : 'موفق' ,
      statusCode : 200,
      data : cart
    }
  }

  private  calculateCartTotalPrice(
  cartProducts: {
    product: { weight: string | number };
    mainProduct: { wages: number };
    count: number;
  }[],
  goldPricePerGram: number
): number {
  let total = 0;


  console.log("cart products in loop",cartProducts);
  


  for (const item of cartProducts) {
    const weight = typeof item.product.weight === 'string'
      ? parseFloat(item.product.weight)
      : item.product.weight;

    const wagePercent = item.mainProduct.wages;
    const wageGrams = weight * (wagePercent / 100);
    const totalWeight = weight + wageGrams;

    const itemPrice = totalWeight * goldPricePerGram;
    total += itemPrice * item.count;
  }

  return total;
  }


}
