import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'کد ورود منقضی شده است',
      statusCode: 200,
      data: 'کد ورود منقضی شده است'
    }
  }
}
