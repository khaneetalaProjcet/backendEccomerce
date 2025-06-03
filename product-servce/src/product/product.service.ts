import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocumnet } from './entities/product.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocumnet>,){}
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
       const all= this.productModel.find().populate('items').exec();
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
}
