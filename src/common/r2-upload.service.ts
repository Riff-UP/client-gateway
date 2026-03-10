import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { envs } from '../config/index.js';
import { randomUUID } from 'crypto';

@Injectable()
export class R2UploadService {
  private readonly logger = new Logger(R2UploadService.name);
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: envs.r2Endpoint,
      credentials: {
        accessKeyId: envs.r2AccessKey,
        secretAccessKey: envs.r2SecretKey,
      },
    });
  }

  async upload(file: Express.Multer.File, folder = 'posts'): Promise<string> {
    const ext = file.originalname.split('.').pop() ?? 'bin';
    const key = `${folder}/${randomUUID()}.${ext}`;

    const cmd = new PutObjectCommand({
      Bucket: envs.r2Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.client.send(cmd);

    const url = `${envs.r2PublicUrl}/${key}`;
    this.logger.log(`Uploaded to R2: ${url}`);
    return url;
  }
}
