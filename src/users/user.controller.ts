import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const errors = [];
    if (createUserDto.name.length < 3)
      errors.push('Name must be at least 3 characters');
    else {
      const nameRegex = new RegExp(/^[a-zA-Z]+$/i);
      if (!nameRegex.test(createUserDto.name))
        errors.push('Name must not contain number or special characters');
    }
    const emailRegex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    if (!emailRegex.test(createUserDto.email))
      errors.push('Invalid email address');
    else {
      const emailExist = await this.userService.checkIfExist({
        email: createUserDto.email,
      });
      if (emailExist !== 0) errors.push('Email already exists');
    }
    if (createUserDto.password.length < 8)
      errors.push('Password must be at least 8 characters');
    else {
      const passwordRegex = new RegExp(
        /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/,
      );
      if (!passwordRegex.test(createUserDto.password))
        errors.push(
          'Password must contain at least 1 number, capitalized letter, lowercase letter and special characters.',
        );
    }
    if (!(createUserDto.birthdate instanceof Date))
      errors.push('Birthdate must be a Date');
    if (errors.length !== 0) return { statusCode: 417, errors };
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const errors = [];
    if (updateUserDto.name.length < 3)
      errors.push('Name must be at least 3 characters');
    else {
      const nameRegex = new RegExp(/^[a-zA-Z]+$/i);
      if (!nameRegex.test(updateUserDto.name))
        errors.push('Name must not contain number or special characters');
    }
    const emailRegex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    if (!emailRegex.test(updateUserDto.email))
      errors.push('Invalid email address');
    else {
      const emailExist = await this.userService.checkIfExistWithout(
        {
          email: updateUserDto.email,
        },
        id,
      );
      if (emailExist !== 0) errors.push('Email already exists');
    }
    if (!(updateUserDto.birthdate instanceof Date))
      errors.push('Birthdate must be a Date');

    if (errors.length != 0) return { statusCode: 417, errors };
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
