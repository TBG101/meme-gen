import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ImagesService } from '../src/images/images.service';
import sharp from 'sharp';
import { Readable } from 'stream';

const TOTAL = 150;

const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const imagesService = app.get(ImagesService);

    for (let i = 1; i <= TOTAL; i++) {
        console.log(`Creating image ${i}/${TOTAL}`);

        const width = random(800, 1600);
        const height = random(800, 1600);

        const response = await fetch(
            `https://picsum.photos/seed/image-${i}/${width}/${height}`,
        );

        if (!response.ok) {
            throw new Error(`Failed to download image ${i}`);
        }

        const originalBuffer = Buffer.from(
            await response.arrayBuffer(),
        );

        const optimizedBuffer = await sharp(originalBuffer)
            .webp({ quality: 25 })
            .toBuffer();

        const file = {
            fieldname: 'image',
            originalname: `seed-${i}.webp`,
            encoding: '7bit',
            mimetype: 'image/webp',
            buffer: optimizedBuffer,
            size: optimizedBuffer.length,
            stream: Readable.from(optimizedBuffer),
            destination: '',
            filename: `seed-${i}.webp`,
            path: '',
        } as Express.Multer.File;

        await imagesService.create({}, file);

        console.log(`Image ${i} created successfully`);
    }

    await app.close();
}

bootstrap().catch(console.error);