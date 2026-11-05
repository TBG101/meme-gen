import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { join } from 'path';
import { mkdir, mkdirSync, writeFile, writeFileSync } from 'fs';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { S3Service } from 'src/common/infrastructure/s3.service';
import sharp from 'sharp';
import { FindAllImagesResponseDto } from './dto/find-all-response.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    @Inject(S3Service)
    private s3Service: S3Service
  ) { }

  async create(createImageDto: CreateImageDto, image: Express.Multer.File) {
    if (!image.mimetype.startsWith("image/")) {
      throw new BadRequestException("Only image files are allowed");
    }

    const metadata = await sharp(image.buffer).metadata();
    const { key, url } = await this.s3Service.upload(image);

    const newImage = new Image();
    newImage.url = url;
    newImage.width = metadata.width ?? 0;
    newImage.height = metadata.height ?? 0;

    return await this.imagesRepository.save(newImage);
  }

  async findAll(query: PaginationQueryDto): Promise<FindAllImagesResponseDto> {
    const { page, limit } = query;

    const [images, count] = await this.imagesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      images,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
