import { Injectable } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
    private region = process.env.AWS_REGION ?? 'us-east-1';
    private endpoint =
        process.env.AWS_ENDPOINT_URL ??
        `https://s3.${this.region}.amazonaws.com`;
    private s3 = new S3Client({
        region: this.region,
        endpoint: this.endpoint,
        forcePathStyle: Boolean(process.env.AWS_ENDPOINT_URL),
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    async upload(file: Express.Multer.File) {
        const key = `images/${Date.now()}-${file.originalname}`;

        await this.s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        const bucket = process.env.AWS_S3_BUCKET;
        const url = process.env.AWS_PUBLIC_URL
            ? `${process.env.AWS_PUBLIC_URL.replace(/\/$/, '')}/${bucket}/${key}`
            : `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return { key, url };
    }
}