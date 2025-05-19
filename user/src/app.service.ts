import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'کد ورود منقضی شده است',
      statusCode: 400,
      error: 'کد ورود منقضی شده است'
    }
  }
}
