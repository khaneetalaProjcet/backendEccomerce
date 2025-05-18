import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('userM') private userModel: Model<UserDocument>,
  ) {}

  

  async checkOrCreate(phoneNumber:string){
    try{
      const user=await this.userModel.findOne({phoneNumber : phoneNumber})
      console.log('user after getting' , user)
      if(!user){
        let newUser=await this.userModel.create({phoneNumber : phoneNumber , authStatus:0})
        console.log('gggg' , newUser)
        // const newUser=new this.userModel({phoneNumber,authStatus:0})
        return newUser
      }
      return user
      
    }catch(error){
      console.log(error);
    }
  }




  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
