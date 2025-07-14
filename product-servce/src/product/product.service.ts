import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductItemDto } from './dto/create-productItem.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocumnet } from './entities/product.entity';
import { Model } from 'mongoose';
import {
  ProductItems,
  ProductItemsDocment,
} from './entities/productItems.entity';
import { UpdateProductItemDto } from './dto/update-productItem.dto';
import e from 'express';
import {
  Category,
  CategoryDocumnet,
} from 'src/category/entities/category.entity';
import { productListQueryDto } from './dto/pagination.dto';
import { ProductFilterDto } from './dto/productFilterdto';
import { goldPriceService } from 'src/goldPrice/goldPrice.service';
import { log } from 'winston';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocumnet>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocumnet>,
    @InjectModel(ProductItems.name)
    private productItemModel: Model<ProductItemsDocment>,
    private goldPriceService: goldPriceService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const items = createProductDto.items;

      const productItems: string[] = [];
      let count = 0;
      for (let index = 0; index < items.length; index++) {
        const element = items[index];

        const i = await this.productItemModel.create({
          size: element.size,
          color: element.color,
          weight: element.weight,
          count: element.count,
        });
        productItems.push(i._id);
        count += element.count;
      }

      createProductDto.items = productItems;

      createProductDto.count = count;

      const product = await this.productModel.create(createProductDto);
      return {
        message: '',
        statusCode: 200,
        data: product,
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

  async findAll(query: productListQueryDto) {
    //  const array= await this.productItemModel.find()
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
    //   await this.productItemModel.findByIdAndDelete(element._id)
    // }

    try {
      const limit = Number(query.limit) || 12;
      const page = Number(query.page) || 0;
      const skip = page * limit;

      const [products, total] = await Promise.all([
        this.productModel
          .find()
          .populate('items')
          .populate('firstCategory')
          .populate('midCategory')
          .populate('lastCategory')
          .skip(skip)
          .limit(limit),
        this.productModel.countDocuments(),
      ]);

      const goldPrice = await this.goldPriceService.getGoldPrice();

      products.map((product: any) => {
        let price = 0;


        for (const item of product.items) {
          price += Number(item.weight || 0) * goldPrice;
        }

        const wageAmount = (price * product.wages) / 100;
        const finalPrice = price + wageAmount;

        const res = (product.price = finalPrice);

        return res;
      });

      // console.log('its after sss' , dataAfterMap);
      console.log(total, '////////');

      // const array= products
      // for (let index = 0; index < array.length; index++) {
      //   const element = array[index];
      //   await this.productModel.findByIdAndDelete(element._id)

      // }

      return {
        message: '',
        statusCode: 200,
        data: products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
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

  async findOne(id: string) {
    try {
      const product = await this.productModel
        .findById(id)
        .populate('items')
        .populate('firstCategory')
        .populate('midCategory')
        .populate('lastCategory');

      if (!product) {
        return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد',
        };
      }

      const goldPrice = await this.goldPriceService.getGoldPrice();

      let price = 0;

      for (const item of product.items) {
        price += Number(item.weight || 0) * goldPrice;
      }

      const wageAmount = (price * product.wages) / 100;
      const finalPrice = price + wageAmount;

      product.price = finalPrice;

      return {
        message: '',
        statusCode: 200,
        data: product,
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      console.log(updateProductDto);
      const product = await this.productModel
        .findByIdAndUpdate(id, updateProductDto)
        .exec();
      if (!product) {
        return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد',
        };
      }
      return {
        message: '',
        statusCode: 200,
        data: product,
      };
    } catch (error) {
      return {
        message: 'مشکل داخلی سیسنم',
        statusCode: 500,
        error: 'مشکل داخلی سیسنم',
      };
    }
  }

  async remove(id: string) {
    try {
      const result = await this.productModel.findByIdAndDelete(id).exec();
      if (!result) {
        return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد',
        };
      }
      return {
        message: '',
        statusCode: 200,
        data: result,
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

  /**
   * prodcut Items services
   *
   *
   */

  async createProductItems(dto: CreateProductItemDto) {
    try {
      console.log('dtotototot', dto);

      const prodcutItem = await this.productItemModel.create({
        weight: dto.weight,
        size: dto.size,
        count: dto.count,
        color: dto.color,
      });

      const product = await this.productModel.findByIdAndUpdate(dto.productId, {
        $push: { items: prodcutItem._id },
        new: true,
      });
      if (!product) {
        return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد',
        };
      }

      product.count += dto.count;
      await product.save();

      return {
        message: '',
        statusCode: 200,
        data: prodcutItem,
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

  async updateProductItems(id: string, dto: UpdateProductItemDto) {
    try {
      const prodcutItem = await this.productItemModel.findByIdAndUpdate(id, {
        count: dto.count,
        color: dto.color,
        size: dto.size,
        weight: dto.weight,
      });
      if (!prodcutItem) {
        return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد',
        };
      }
      const product = await this.productModel
        .findById(dto.productId)
        .populate('items')
        .exec();
      if (!product) {
        return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد',
        };
      }
      let count = 0;
      for (let index = 0; index < product.items.length; index++) {
        const element = product.items[index];
        count += element.count;
      }

      product.count = count;
      await product.save();

      return {
        message: '',
        statusCode: 200,
        data: product.items,
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

  async removeProductItems(id: string, productId: string) {
    try {
      console.log('prodcutId', productId);
      console.log('item', id);
      const prodcut = await this.productModel.findById(productId);

      console.log(prodcut?.items);

      const prodcutItem = await this.productItemModel.findById(id);

      console.log(prodcutItem);

      if (!prodcut) {
        return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد',
        };
      }

      if (!prodcutItem) {
        return {
          message: 'واریانت محصول پیدا نشد',
          statusCode: 400,
          error: 'واریانت محصول پیدا نشد',
        };
      }

      const newItems = prodcut.items.filter((i) => i != id);

      prodcut.count = prodcut.count - prodcutItem.count;
      prodcut.items = newItems;
      await prodcut.save();
      await this.productItemModel.findByIdAndDelete(id);

      return {
        message: '',
        statusCode: 200,
        data: prodcutItem,
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

  async getProductBasedOnCategory(
    categoryId: string,
    query: productListQueryDto,
  ) {
    try {
      const limit = Number(query.limit) || 12;
      const page = Number(query.page) || 0;
      const skip = (page-1) * limit;

      const category = await this.categoryModel.findById(categoryId).populate({
        path: 'parent',
        populate: { path: 'parent' },
      });

      if (!category) {
        return {
          message: 'دسته بندی انتخابی موجود نمی‌باشد',
          statusCode: 400,
          error: 'دسته بندی انتخابی موجود نمی‌باشد',
        };
      }

      const filter = {
        $or: [
          { firstCategory: categoryId },
          { midCategory: categoryId },
          { lastCategory: categoryId },
        ],
      };

      const [products, total] = await Promise.all([
        this.productModel
          .find(filter)
          .populate('items')
          .populate('firstCategory')
          .populate('midCategory')
          .populate('lastCategory')
          .skip(skip)
          .limit(limit),
        this.productModel.countDocuments(filter),
      ]);

      const goldPrice = await this.goldPriceService.getGoldPrice();

      products.map((product: any) => {
        let price = 0;

        for (const item of product.items) {
          price += Number(item.weight || 0) * goldPrice;
        }
        
        const wageAmount = (price * product.wages) / 100;
        const finalPrice = price + wageAmount;

        const res = (product.price = finalPrice);

        return res;
      });

      console.log(products, '////// pppppproducts is here');

      console.log(total, '////// total is here');

      return {
        message: 'موفق',
        statusCode: 200,
        data: {
          products,
          category,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      console.log('error in getting category products', error);
      return {
        message: 'ناموفق',
        statusCode: 500,
        error: 'خطای داخلی سرور',
      };
    }
  }

  async filterProductsByPrice(query: ProductFilterDto) {
    const { minPrice = 0, maxPrice = 0 } = query;

    const goldPrice = await this.goldPriceService.getGoldPrice();

    const products = await this.productModel.find().populate({
      path: 'items',
      model: 'ProductItems',
    });

    const filteredProducts = products.filter((product: any) => {
      let price = 0;
      
      for (const item of product.items) {
        price += Number(item.weight || 0) * goldPrice;
      }

      const wageAmount = (price * product.wages) / 100;
      const finalPrice = price + wageAmount;

      const result = finalPrice >= minPrice && finalPrice <= maxPrice;

      console.log(result,"///////result");
      

      return result;
    });

    return {
      message: 'موفق',
      statusCode: 200,
      data: filteredProducts,
    };
  }
}
