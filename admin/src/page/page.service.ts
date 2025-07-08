import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, pageDocument } from './entities/page.entity';
import { CreatePageDto } from './dto/createPage.dto';
import { UpdatePageDto } from './dto/updatePage.dto';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name) private readonly pageModel: Model<pageDocument>,
  ) {}

  async create(createDto: any) {
    try {
      console.log(createDto)
      for (let i of createDto){
        const created = new this.pageModel(i);
        const response = await created.save();
      }
      return {
        message: 'done',
        statusCode: 200,
        data: 'done',
      };
    } catch (error) {
      console.log(error, 'error is here');
    }
  }

  async findAll() {
    try {
      const page = await this.pageModel.find().exec();

        return {
        message: 'done',
        statusCode: 200,
        data: page,
      };
    } catch (error) {
      console.log(error)
    }
  }

  async findOne(id: string) {
    const page = await this.pageModel.findById(id).exec();
    if (!page) throw new NotFoundException(`Page with id ${id} not found`);
    return page;
  }

  async update(id: string, updateDto: UpdatePageDto) {
    try {
      const updated = await this.pageModel
        .findByIdAndUpdate(id, updateDto, { new: true })
        .exec();

      if (!updated) throw new NotFoundException(`Page with id ${id} not found`);

      return {
        message: 'done',
        statusCode: 200,
        data: updated,
      };
    } catch (error) {
      console.error('Error updating page:', error);
    }
  }
  async remove(id: string) {
  try {
    const deleted = await this.pageModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException(`Page with id ${id} not found`);
    }

    console.log(deleted, 'deleted document');

    return {
      message: 'Page successfully deleted',
      statusCode: 200,
      data: deleted,
    };
  } catch (error) {
    console.error('Error deleting page:', error);
  }
}
}
