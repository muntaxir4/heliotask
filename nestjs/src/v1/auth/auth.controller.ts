import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/google')
  async googleAuth(@Body('code') code: string, @Res() res: Response) {
    return await this.authService.googleAuth(code, res);
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    return await this.authService.logout(res);
  }
}
