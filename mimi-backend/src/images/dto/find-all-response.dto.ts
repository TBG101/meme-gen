import { Image } from '../entities/image.entity';

export class FindAllImagesResponseDto {
    images!: Image[];
    count!: number;
    page!: number;
    limit!: number;
    totalPages!: number;
}