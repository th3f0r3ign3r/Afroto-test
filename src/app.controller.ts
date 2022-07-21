import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { CreateUserDto } from './users/dto/create-users.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const errors = [];
    if (createUserDto.name.length < 3)
      errors.push('Name must be at least 3 characters');
    else {
      const nameRegex = new RegExp(/^[a-zA-Z ]+$/i);
      if (!nameRegex.test(createUserDto.name))
        errors.push('Name must not contain number or special characters');
    }
    const emailRegex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    if (!emailRegex.test(createUserDto.email))
      errors.push('Invalid email address');
    else {
      const emailExist = await this.usersService.checkIfExist({
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
    return this.usersService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    const { access_token } = await this.authService.login(req.user);
    return { statusCode: true, access_token };
  }
}
