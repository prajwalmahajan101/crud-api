import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { EditUserDto } from '@/user/dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  editUser(id: number, data: EditUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
