import { Controller, Post, Res, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    // private readonly appService: AppService,
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  register(@Res() res) {
    return res.redirect('/users');
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    const { access_token } = await this.authService.login(req.user);
    return { statusCode: true, access_token };
  }
}
