import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    return {
      statusCode: 200,
      data: await new this.userModel({
        name: createUserDto.name,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
        birthdate: createUserDto.birthdate,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).save(),
    };
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async checkIfExist(query: any) {
    return await this.userModel.find(query).count();
  }

  async checkIfExistWithout(query: any, value: string) {
    return await this.userModel
      .find(query)
      .where('_id')
      .ne(value)
      .count()
      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userModel
      .findByIdAndUpdate(id, {
        name: updateUserDto.name,
        email: updateUserDto.email,
        birthdate: updateUserDto.birthdate,
        bio: updateUserDto.bio,
        updatedAt: new Date(),
      })
      .exec();
    return this.userModel.findOne({ _id: id });
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
