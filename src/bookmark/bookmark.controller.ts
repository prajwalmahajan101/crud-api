import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser, JWTAuthGuard } from '@/auth/decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';
import { BookMark } from '@prisma/client';

@JWTAuthGuard()
@ApiTags('Bookmark')
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  @ApiOperation({ summary: 'Create Bookmark' })
  @ApiCreatedResponse({ description: 'Bookmark created' })
  @ApiBadRequestResponse({ description: 'Invalid/No Body/Param Passed' })
  create(
    @GetUser('id') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ): Promise<BookMark> {
    return this.bookmarkService.create(userId, createBookmarkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Bookmark' })
  @ApiOkResponse({ description: 'Fetched All Bookmarks' })
  findAll(@GetUser('id') userId: number): Promise<BookMark[]> {
    return this.bookmarkService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Specific Bookmark' })
  @ApiNotFoundResponse({ description: 'Bookmark not found' })
  @ApiOkResponse({ description: 'Fetched Bookmark' })
  async findOne(
    @GetUser('id') userId: number,
    @Param('id') id: number,
  ): Promise<BookMark> {
    if (isNaN(id)) {
      throw new BadRequestException({
        description: `Id passed is not a number`,
      });
    }
    return await this.bookmarkService.findOne(userId, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit Bookmark' })
  @ApiNotFoundResponse({ description: 'Bookmark not found' })
  @ApiOkResponse({ description: 'Bookmark Updated' })
  update(
    @GetUser('id') userId: number,
    @Param('id') id: number,
    @Body() dto: UpdateBookmarkDto,
  ): Promise<BookMark> {
    if (isNaN(id)) {
      throw new BadRequestException(`Id passed is not a number`);
    }
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(`No Body Found`);
    }
    return this.bookmarkService.update(userId, +id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Bookmark' })
  @ApiNotFoundResponse({ description: 'Bookmark not found' })
  @ApiOkResponse({ description: 'Bookmark deleted' })
  remove(
    @GetUser('id') userId: number,
    @Param('id') id: number,
  ): Promise<BookMark> {
    if (isNaN(id)) {
      throw new BadRequestException({
        description: `Id passed is not a number`,
      });
    }
    return this.bookmarkService.remove(userId, +id);
  }
}
