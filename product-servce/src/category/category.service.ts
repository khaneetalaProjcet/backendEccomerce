import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category,CategoryDocumnet } from './entities/category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocumnet>){}



  async createCategory(name: string,description:string, parentId?: string) {
  const newCategory = new this.categoryModel({ name, description});

  if (parentId) {
    const parent = await this.categoryModel.findById(parentId);
    if (!parent) {
       return {
          message: 'دسته بندی پیدا نشد',
          statusCode: 400,
          error: 'دسته بندی پیدا نشد'
        }
    }

    newCategory.parent = parent._id;

    await this.categoryModel.updateOne(
      { _id: parentId },
      { $push: { children: newCategory._id } }
    );
  }

   await newCategory.save()
  return {
        message: 'دسته بندی ساخته شد',
        statusCode: 200,
        data:  newCategory
      }
  }

 async getCategoryTree(parentId: string | null = null) {
  const categories = await this.categoryModel
    .find({ parent: parentId })
    .lean(); // lean() for plain JS objects

  const tree = await Promise.all(
    categories.map(async (category) => {
      const children = await this.getCategoryTree(category._id.toString());
      return {
        ...category,
        children,
      };
    }),
  );

  // return tree;

   return {
        message: '',  
        statusCode: 200,
        data:  tree
      }
 }

 async updateCategory(id: string, updateDto: { name?: string }) {
  const category = await this.categoryModel.findById(id);
  if (!category) {
     return {
          message: 'دسته بندی پیدا نشد',
          statusCode: 400,
          error: 'دسته بندی پیدا نشد'
        }
  };

  const { name } = updateDto;

  if (name) {
    category.name = name;
    await category.save();
  }

  return category;
}

 // category.service.ts

async deleteCategory(id: string){
  const category = await this.categoryModel.findById(id);
  if (!category) {
      return {
          message: 'دسته بندی پیدا نشد',
          statusCode: 400,
          error: 'دسته بندی پیدا نشد'
        }
  }

  // Remove from parent's children
  if (category.parent) {
    await this.categoryModel.findByIdAndUpdate(category.parent, {
      $pull: { children: category._id },
    });
  }

  // Recursively delete all children
  await this._deleteSubtree(category._id);

  // Delete the category itself
  await this.categoryModel.findByIdAndDelete(id);

  return {
        message: 'دسته بندی حذف شد',
        statusCode: 200,
        data:  category
  }
}

private async _deleteSubtree(parentId: string): Promise<void> {
  const children = await this.categoryModel.find({ parent: parentId });
  for (const child of children) {
    await this._deleteSubtree(child._id);
    await this.categoryModel.findByIdAndDelete(child._id);
  }
}



  // create(createCategoryDto: CreateCategoryDto) {
  //   return 'This action adds a new category';
  // }

  // findAll() {
  //   return `This action returns all category`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
