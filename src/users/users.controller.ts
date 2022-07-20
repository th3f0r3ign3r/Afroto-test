import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
    const dateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
    if (!dateRegex.test(createUserDto.birthdate))
      errors.push('Birthdate should be in the format yyyy-mm-dd');
    else {
      const d = new Date(createUserDto.birthdate);
      const dNum = d.getTime();
      if (!dNum && dNum !== 0) errors.push('Invalid birthdate date');
    }
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
    const dateRegex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
    if (!dateRegex.test(updateUserDto.birthdate))
      errors.push('Birthdate should be in the format yyyy-mm-dd');
    else {
      const d = new Date(updateUserDto.birthdate);
      const dNum = d.getTime();
      if (!dNum && dNum !== 0) errors.push('Invalid birthdate date');
    }
    if (errors.length != 0) return { statusCode: 417, errors };
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
