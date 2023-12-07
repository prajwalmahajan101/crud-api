import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { JWTAuthGuard } from '@/auth/decorator';

import { GetUser } from './decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  @Get('me')
  @JWTAuthGuard()
  getMe(@GetUser() user: User) {
    return { user };
  }
}
