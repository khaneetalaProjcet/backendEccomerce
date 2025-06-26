import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './entities/log.entity';
import { CreateLogDto } from './dtos/create-log.dto';

interface LogFilterOptions {
  role?: string;
  firstName?: string;
  lastName?: string;
  startDate?: string;
  endDate?: string;
  startHour?: string;
  endHour?: string;
  activity?: string;
}

@Injectable()
export class LoggerService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async create(createLogDto: CreateLogDto) {
    try {
      const newLog = new this.logModel(createLogDto);
      return await newLog.save();
    } catch (error) {
      console.error('Error while saving log:', error);
      throw new InternalServerErrorException('Could not save log');
    }
  }

  async findAllLogs(
    options: LogFilterOptions & { page?: number; limit?: number },
  ) {
    const filter: any = {};

    if (options.role) filter.role = options.role;
    if (options.firstName)
      filter.firstName = { $regex: options.firstName, $options: 'i' };
    if (options.lastName)
      filter.lastName = { $regex: options.lastName, $options: 'i' };
    if (options.activity)
      filter.activity = { $regex: options.activity, $options: 'i' };

    if (
      options.startDate ||
      options.endDate ||
      options.startHour ||
      options.endHour
    ) {
      filter.timestamp = {};
      if (options.startDate)
        filter.timestamp.$gte = new Date(options.startDate);
      if (options.endDate) {
        const end = new Date(options.endDate);
        end.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = end;
      }
      if (options.startDate && (options.startHour || options.endHour)) {
        const baseDate = new Date(options.startDate);
        if (options.startHour) {
          const [h, m] = options.startHour.split(':').map(Number);
          const startHourDate = new Date(baseDate);
          startHourDate.setHours(h, m, 0, 0);
          filter.timestamp.$gte = startHourDate;
        }
        if (options.endHour) {
          const [h, m] = options.endHour.split(':').map(Number);
          const endHourDate = new Date(baseDate);
          endHourDate.setHours(h, m, 59, 999);
          filter.timestamp.$lte = endHourDate;
        }
      }
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.logModel
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.logModel.countDocuments(filter),
    ]);

    return { data, total };
  }
}
