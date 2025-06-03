import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductItemDto } from './dto/create-productItem.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocumnet } from './entities/product.entity';
import { Model } from 'mongoose';
import { ProductItems, ProductItemsDocment } from './entities/productItems.entity';
import { UpdateProductItemDto } from './dto/update-productItem.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocumnet>,
   @InjectModel(ProductItems.name) private productItemModel: Model<ProductItemsDocment>){}
  async create(createProductDto: CreateProductDto) {
    try{
    const product=await this.productModel.create(createProductDto);
     return {
        message: '',
        statusCode: 200,
        data:product

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

  async findAll() {
    try{
       const all= await this.productModel.find().populate('items').exec();
       
       return {
       message: '',
        statusCode: 200,
        data:all
      }
    }
    catch(error){
      return {
          message: 'مشکل داخلی سیسنم',
          statusCode: 500,
          error: 'مشکل داخلی سیسنم'
        }
    }
  }

  async findOne(id:string) {
    try{
       const product = await this.productModel.findById(id).populate('items').exec();
    if (!product) {
       return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد'
        }
    }
    return {
       message: '',
        statusCode: 200,
        data:product
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    try{
       const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    if (!product) {
       return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد'
        }
    }
    return {
        message: '',
        statusCode: 200,
        data:product
    };
    }catch(error){
       return {
          message: 'مشکل داخلی سیسنم',
          statusCode: 500,
          error: 'مشکل داخلی سیسنم'
        }
    }
  }

  async remove(id: string) {
    try{
       const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد'
        }
    }
    return {
        message: '',
        statusCode: 200,
        data:result
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



  /**
   * prodcut Items services
   * 
   * 
   */


  async createProductItems(dto:CreateProductItemDto){
    try{
      
    const prodcutItem=await this.productItemModel.create({
      weight:dto.weight,
      size:dto.size,
      count:dto.count,
      color:dto.color
    })
    
    const product=await this.productItemModel.findByIdAndUpdate(dto.productId,{
      $push: { items: prodcutItem._id } ,
      new: true ,
    })
    if(!product){
        return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد'
        }
    }
    return {
       message: '',
        statusCode: 200,
        data:prodcutItem
    }
   
    }catch(error){
      console.log("error",error);
      return {
          message: 'مشکل داخلی سیسنم',
          statusCode: 500,
          error: 'مشکل داخلی سیسنم'
        }
    }
    


  }

  async updateProductItems(id:string,dto:UpdateProductItemDto){
    try{
    const prodcutItem=await this.productItemModel.findByIdAndUpdate(id,dto)
    if(!prodcutItem){
        return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد'
        }
    }
    return {
        message: '',
        statusCode: 200,
        data:prodcutItem
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

  async removeProductItems(id:string){
    try{
      const prodcutItem=await this.productItemModel.findByIdAndDelete(id)
    if(!prodcutItem){
       return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد'
        }
    }

    const prodcut=await this.productModel.findByIdAndUpdate(id,
      { $pull: { items: id } }
    )

    if(!prodcut){
      return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد'
        }
    }

    return {
        message: '',
        statusCode: 200,
        data:prodcutItem
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

  

  

  








}
