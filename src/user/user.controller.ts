import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { JWTAuthGuard, GetUser } from '@/auth/decorator';
import { EditUserDto } from '@/user/dto';
import { UserService } from '@/user/user.service';

@JWTAuthGuard()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User): { user: User } {
    return { user };
  }

  @Patch('/')
  @ApiBadRequestResponse({ description: 'Invalid/No Body' })
  @ApiOkResponse({ description: 'User Updated' })
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ): Promise<User> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No Body Found');
    }
    return this.userService.editUser(userId, dto);
  }
}
