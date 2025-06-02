import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category,CategoryDocumnet } from './entities/category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import path from 'path';
interface CategoryTreeNode {
  _id: string;
  name: string;
  description: string;
  parent: string | null;
  children: CategoryTreeNode[];
}


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

 async getCategoryTree() {
  
  const tree=await this.categoryModel.find({parent:null}).populate({
     path: 'children',
     populate: {
      path: 'children',
      populate:{
        path:"children"
      }
    }
  })
  
     return {
        message: '',  
        statusCode: 200,
        data:  tree
      }
 

 }

 async findOne(id:string){
  const category=await this.categoryModel.findById(id)

     return {
        message: '',  
        statusCode: 200,
        data: category 
      }

 }

 async updateCategory(id: string, updateDto: { name?: string , description?:string  }) {
  try{
    const category = await this.categoryModel.findById(id);
  if (!category) {
     return {
          message: 'دسته بندی پیدا نشد',
          statusCode: 400,
          error: 'دسته بندی پیدا نشد'
        }
  };

  const { name , description } = updateDto;

  if (name) {
    category.name = name;
    await category.save();
  }
  if(description){
    category.description=description
    await category.save()
  }

  return {
        message: 'دسته بندی اپدیت شد',
        statusCode: 200,
        data:  category
      }
  }catch(err){
    console.log(err);
    return {
          message: 'مشکل داخلی سیسنم',
          statusCode: 500,
          error: 'مشکل داخلی سیسنم'
        }
  }
  
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
