import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() { email }: { email: string }) {
    return await this.userService.register(email);
  }
}
