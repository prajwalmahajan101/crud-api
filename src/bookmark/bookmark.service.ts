import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BookMark } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  create(userId: number, dto: CreateBookmarkDto): Promise<BookMark> {
    return this.prisma.bookMark.create({ data: { ...dto, userId } });
  }

  findAll(userId: number): Promise<BookMark[]> {
    return this.prisma.bookMark.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(userId: number, id: number): Promise<BookMark> {
    const bookmark: BookMark | null = await this.prisma.bookMark.findUnique({
      where: { id },
    });
    if (!bookmark) {
      throw new NotFoundException(`Bookmark with id ${id} not found`);
    }
    if (bookmark.userId !== userId) {
      throw new UnauthorizedException('Unauthorized Access');
    }
    return bookmark;
  }

  async update(
    userId: number,
    id: number,
    data: UpdateBookmarkDto,
  ): Promise<BookMark> {
    const bookmark: BookMark = await this.findOne(userId, id);
    return this.prisma.bookMark.update({
      where: { id },
      data: data,
    });
  }

  async remove(userId: number, id: number): Promise<BookMark> {
    const bookmark: BookMark = await this.findOne(userId, id);
    return this.prisma.bookMark.delete({
      where: {
        id,
      },
    });
  }
}
