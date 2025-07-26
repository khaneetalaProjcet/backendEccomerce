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
import {
  Category,
  CategoryDocumnet,
} from 'src/category/entities/category.entity';
import { productListQueryDto } from './dto/pagination.dto';
import { ProductFilterDto } from './dto/productFilterdto';
import { goldPriceService } from 'src/goldPrice/goldPrice.service';
import { Order, OrderInterface } from '../order/entities/order.entity';
import { InterserviceService } from 'src/interservice/interservice.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocumnet>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocumnet>,
    @InjectModel(ProductItems.name)
    @InjectModel(Order.name)
    private orderModel: Model<OrderInterface>,
    private productItemModel: Model<ProductItemsDocment>,
    private goldPriceService: goldPriceService,
    private interservice: InterserviceService,
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

  async findAll(query: ProductFilterDto) {
    try {
      const limit = Number(query.limit) || 12;
      const page = (!isNaN(Number(query.page)) && Number(query.page)) || 1;
      const skip = (page - 1) * limit;

      const minPrice = !isNaN(Number(query.minPrice))
        ? Number(query.minPrice)
        : 0;
      const maxPrice = !isNaN(Number(query.maxPrice))
        ? Number(query.maxPrice)
        : 0;
      const minWeight = !isNaN(Number(query.minWeight))
        ? Number(query.minWeight)
        : 0;
      const maxWeight = !isNaN(Number(query.maxWeight))
        ? Number(query.maxWeight)
        : 0;
      const color =
        query.color && query.color !== 'undefined' ? query.color.trim() : null;

      const goldPrice = await this.goldPriceService.getGoldPrice();

      const products = await this.productModel
        .find()
        .populate('items')
        .populate('firstCategory')
        .populate('midCategory')
        .populate('lastCategory');

      const filteredProducts = products
        .filter((product: any) => {
          return product.items.some((item: any) => {
            const weight = Number(item.weight || 0);
            const basePrice = weight * goldPrice;
            const wage = (basePrice * product.wages) / 100;
            const finalPrice = basePrice + wage;

            item.price = finalPrice;

            const inPriceRange =
              (minPrice === 0 && maxPrice === 0) ||
              (finalPrice >= minPrice && finalPrice <= maxPrice);

            const inWeightRange =
              (minWeight === 0 && maxWeight === 0) ||
              (weight >= minWeight && weight <= maxWeight);

            const matchesColor = !color || item.color?.trim() === color;

            return inPriceRange && inWeightRange && matchesColor;
          });
        })
        .map((product: any) => {
          const filteredItems = product.items.filter((item: any) => {
            const weight = Number(item.weight || 0);
            const basePrice = weight * goldPrice;
            const wage = (basePrice * product.wages) / 100;
            const finalPrice = basePrice + wage;

            item.price = finalPrice;

            const inPriceRange =
              (minPrice === 0 && maxPrice === 0) ||
              (finalPrice >= minPrice && finalPrice <= maxPrice);

            const inWeightRange =
              (minWeight === 0 && maxWeight === 0) ||
              (weight >= minWeight && weight <= maxWeight);

            const matchesColor = !color || item.color?.trim() === color;

            return inPriceRange && inWeightRange && matchesColor;
          });

          return {
            ...(product.toObject?.() ?? product),
            items: filteredItems,
          };
        });

      const total = filteredProducts.length;
      const paginatedProducts = filteredProducts.slice(skip, skip + limit);

      return {
        message: 'دریافت محصولات با موفقیت انجام شد',
        statusCode: 200,
        data: paginatedProducts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.log('error in finding all products', error);
      return {
        message: 'مشکل داخلی سیستم',
        statusCode: 500,
        error: 'مشکل داخلی سیستم',
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
        .populate('lastCategory')
        .populate({
          path: 'suggestedProducts',
          populate: ['items', 'firstCategory', 'midCategory', 'lastCategory'],
        });

      if (!product) {
        return {
          message: 'محصول پیدا نشد',
          statusCode: 400,
          error: 'محصول پیدا نشد',
        };
      }

      const goldPrice = await this.goldPriceService.getGoldPrice();

      const allOtherProducts = await this.productModel
        .find({ _id: { $ne: product._id } })
        .populate('items')
        .populate('firstCategory')
        .populate('midCategory')
        .populate('lastCategory');

      for (const suggested of allOtherProducts) {
        let suggestedTotal = 0;
        for (const item of suggested.items) {
          const weight = Number(item.weight || 0);
          const basePrice = weight * goldPrice;
          const wageAmount = (basePrice * suggested.wages) / 100;
          const itemFinalPrice = basePrice + wageAmount;
          item.price = itemFinalPrice;
          suggestedTotal += itemFinalPrice;
        }
        const suggestedWageAmount = (suggestedTotal * suggested.wages) / 100;
        suggested.price = suggestedTotal + suggestedWageAmount;
      }

      product.suggestedProducts = allOtherProducts;
      let totalPrice = 0;

      for (const item of product.items) {
        const weight = Number(item.weight || 0);
        const basePrice = weight * goldPrice;
        const wageAmount = (basePrice * product.wages) / 100;
        const itemFinalPrice = basePrice + wageAmount;

        item.price = itemFinalPrice;
        totalPrice += itemFinalPrice;
      }

      const wageAmount = (totalPrice * product.wages) / 100;
      const finalPrice = totalPrice + wageAmount;

      product.price = finalPrice;

      return {
        message: '',
        statusCode: 200,
        data: {
          ...product.toObject(),
          suggestedProducts: allOtherProducts,
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
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
        discountPercent: dto.discountPercent,
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
      const prodcut = await this.productModel.findById(productId);

      const prodcutItem = await this.productItemModel.findById(id);

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

  async getProductBasedOnCategory(categoryId: string, query: ProductFilterDto) {
    try {
      const limit = Number(query.limit) || 12;
      const page = (!isNaN(Number(query.page)) && Number(query.page)) || 1;
      const skip = (page - 1) * limit;

      const minPrice = !isNaN(Number(query.minPrice))
        ? Number(query.minPrice)
        : 0;
      const maxPrice = !isNaN(Number(query.maxPrice))
        ? Number(query.maxPrice)
        : 0;
      const minWeight = !isNaN(Number(query.minWeight))
        ? Number(query.minWeight)
        : 0;
      const maxWeight = !isNaN(Number(query.maxWeight))
        ? Number(query.maxWeight)
        : 0;
      const color =
        query.color && query.color !== 'undefined' ? query.color.trim() : null;

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

      const products = await this.productModel
        .find(filter)
        .populate('items')
        .populate('firstCategory')
        .populate('midCategory')
        .populate('lastCategory');

      const goldPrice = await this.goldPriceService.getGoldPrice();

      for (const product of products) {
        for (const item of product.items) {
          const weight = Number(item.weight || 0);
          const basePrice = weight * goldPrice;
          const wage = (basePrice * product.wages) / 100;
          item.price = basePrice + wage;
        }
      }

      const filteredProducts = products
        .filter((product: any) => {
          return product.items.some((item: any) => {
            const weight = Number(item.weight || 0);
            const price = Number(item.price || 0);
            const itemColor = item.color?.trim();

            const inPriceRange =
              (minPrice === 0 && maxPrice === 0) ||
              (price >= minPrice && price <= maxPrice);

            const inWeightRange =
              (minWeight === 0 && maxWeight === 0) ||
              (weight >= minWeight && weight <= maxWeight);

            const matchesColor = !color || itemColor === color;

            return inPriceRange && inWeightRange && matchesColor;
          });
        })
        .map((product: any) => {
          const filteredItems = product.items.filter((item: any) => {
            const weight = Number(item.weight || 0);
            const price = Number(item.price || 0);
            const itemColor = item.color?.trim();

            const inPriceRange =
              (minPrice === 0 && maxPrice === 0) ||
              (price >= minPrice && price <= maxPrice);

            const inWeightRange =
              (minWeight === 0 && maxWeight === 0) ||
              (weight >= minWeight && weight <= maxWeight);

            const matchesColor = !color || itemColor === color;

            return inPriceRange && inWeightRange && matchesColor;
          });

          return {
            ...(product.toObject?.() ?? product),
            items: filteredItems,
          };
        });

      const total = filteredProducts.length;
      const paginatedProducts = filteredProducts.slice(skip, skip + limit);

      return {
        message: 'موفق',
        statusCode: 200,
        data: {
          products: paginatedProducts,
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

      return result;
    });

    return {
      message: 'موفق',
      statusCode: 200,
      data: filteredProducts,
    };
  }

  // async addDiscount(productId: string, dto: UpdateProductItemDto) {
  //   try {
  //     const discountPercent = dto.discountPercent;

  //     const updatedProductItem = await this.productItemModel.findByIdAndUpdate(
  //       productId,
  //       {
  //         discountPercent: discountPercent,
  //       },
  //     );

  //     if (!updatedProductItem) {
  //       return {
  //         message: 'محصول مورد نظر یافت نشد',
  //         statusCode: 400,
  //         data: null,
  //       };
  //     }

  //     return {
  //       message: 'موفق',
  //       statusCode: 200,
  //       data: updatedProductItem,
  //     };
  //   } catch (error) {
  //     return {
  //       message: 'internal server error',
  //       statusCode: 500,
  //       data: null,
  //     };
  //   }
  // }

  async recommandation(query: productListQueryDto) {
    try {
      const limit = Number(query.limit) || 12;
      const page = Number(query.page) || 0;
      const skip = page * limit;

      const goldPrice = await this.goldPriceService.getGoldPrice();

      const allProducts = await this.productModel
        .find()
        .populate('items')
        .populate('firstCategory')
        .populate('midCategory')
        .populate('lastCategory');

      const discountedProducts = [] as any;

      for (const product of allProducts) {
        let hasDiscount = false;

        for (const item of product.items) {
          if (item.discountPercent > 0) {
            hasDiscount = true;
          }
        }

        if (hasDiscount) {
          let totalPrice = 0;

          product.items = product.items.map((item: any) => {
            const basePrice = Number(item.weight || 0) * goldPrice;
            const discountPercent = item.discountPercent || 0;

            const wage = (basePrice * product.wages) / 100;
            const priceWithWage = basePrice + wage;

            const discountAmount = (priceWithWage * discountPercent) / 100;
            const priceAfterDiscount = priceWithWage - discountAmount;

            item.price = priceWithWage;
            item.priceAfterDiscount = priceAfterDiscount;

            totalPrice += priceAfterDiscount;
            return item;
          });

          product.price = totalPrice;
          discountedProducts.push(product);
        }
      }

      const total = discountedProducts.length;
      const paginatedProducts = discountedProducts.slice(skip, skip + limit);

      return {
        message: '',
        statusCode: 200,
        data: paginatedProducts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'مشکل داخلی سیستم',
        statusCode: 500,
        error: 'مشکل داخلی سیستم',
      };
    }
  }

  async filterProductsByAttributes(query: ProductFilterDto) {
    try {
      const limit = Number(query.limit) || 12;
      const page = Number(query.page) || 0;
      const skip = page * limit;

      const {
        minPrice = 0,
        maxPrice = 0,
        color,
        size,
        minWeight = 0,
        maxWeight = 0,
      } = query;

      const products = await this.productModel
        .find()
        .populate('items')
        .populate('firstCategory')
        .populate('midCategory')
        .populate('lastCategory');

      const goldPrice = await this.goldPriceService.getGoldPrice();

      const filteredProducts = products.filter((product: any) => {
        let hasMatchingItem = false;

        for (const item of product.items) {
          const itemWeight = Number(item.weight || 0);
          const basePrice = itemWeight * goldPrice;
          const wageAmount = (basePrice * product.wages) / 100;
          const finalPrice = basePrice + wageAmount;

          const inPriceRange = finalPrice >= minPrice && finalPrice <= maxPrice;
          const inWeightRange =
            itemWeight >= minWeight && itemWeight <= maxWeight;
          const matchesColor = !color || item.color === color;
          const matchesSize = !size || item.size === size;

          const isMatch =
            inPriceRange && inWeightRange && matchesColor && matchesSize;

          if (isMatch) {
            hasMatchingItem = true;
            break;
          }
        }

        return hasMatchingItem;
      });

      const total = filteredProducts.length;
      const paginatedProducts = filteredProducts.slice(skip, skip + limit);

      return {
        message: 'فیلتر با موفقیت انجام شد',
        statusCode: 200,
        data: paginatedProducts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return {
        message: 'internal server error',
        statusCode: 500,
        data: null,
      };
    }
  }

  async getSummary() {
    const totalProducts = await this.productModel.countDocuments();
    const totalOrders = await this.orderModel.countDocuments();
    const totalUsers = await this.interservice.getUsers();

    const userCoount = totalUsers.length;

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const orderOfLastMonth = await this.orderModel.countDocuments({
      status: 1,
      createdAt: {
        $gte: lastMonth,
        $lt: startOfThisMonth,
      },
    });

    return {
      totalProducts,
      totalOrders,
      userCoount,
      orderOfLastMonth,
    };
  }

  async delete() {
    try {
      const result = await this.productModel.deleteMany({}); // deletes all documents in the collection

      return {
        message: 'All products deleted successfully',
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      throw new Error(`Failed to delete all products: ${error.message}`);
    }
  }
}
