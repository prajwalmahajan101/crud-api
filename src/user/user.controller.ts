import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { JWTAuthGuard, GetUser } from '@/auth/decorator';
import { EditUserDto } from '@/user/dto';
import { UserService } from '@/user/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  @JWTAuthGuard()
  getMe(@GetUser() user: User): { user: User } {
    return { user };
  }

  @Patch('/')
  @JWTAuthGuard()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ): Promise<User> {
    return this.userService.editUser(userId, dto);
  }
}
