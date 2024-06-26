/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import {
  LoginDto,
  LoginWIthGoogleDTO,
  RegisterDto,
  ResetPasswordDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JwtGuard, JwtGuardRefreshToken } from './auth.guard';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-update_by.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('logingoogle')
  async loginwithgoogle(@Body() payload: LoginWIthGoogleDTO) {
    return this.authService.loginWithGoogle(payload);
  }

  @Get('getgoogledata/:id')
  async getData(@Param('id') id: string) {
    return this.authService.getDataloginGoogle(id);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Req() req) {
    const { id } = req.user;
    return this.authService.myProfile(id);
  }

  @UseGuards(JwtGuardRefreshToken)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.headers.id;
    return this.authService.refreshToken(+id, token);
  }

  @Post('lupa-password')
  async forgotPassowrd(@Body('email') email: string) {
    console.log('email', email);
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password/:user_id/:token')
  async resetPassword(
    @Param('user_id') user_id: string,
    @Param('token') token: string,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(+user_id, token, payload);
  }
}
