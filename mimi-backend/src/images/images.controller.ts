import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, HttpCode, HttpStatus } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { FindAllImagesResponseDto } from './dto/find-all-response.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createImageDto: CreateImageDto, @UploadedFile() image: Express.Multer.File) {
    return await this.imagesService.create(createImageDto, image);
  }

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<FindAllImagesResponseDto> {
    return await this.imagesService.findAll(query);
  }
}