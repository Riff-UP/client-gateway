import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UpdatePostsDto } from '../../dto';
import { CONTENT_SERVICE } from '../../../config/services.js';
import { ClientProxy } from '@nestjs/microservices';
import { handleRpcCustomError, PaginationDto, R2UploadService } from '../../../common';
import { catchError, firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard.js';
import { GetUser } from '../../../auth/decorators/get-user.decorator.js';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger('PostsController');

  constructor(
    @Inject(CONTENT_SERVICE) private readonly contentService: ClientProxy,
    private readonly r2: R2UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', { storage: memoryStorage() }), // buffer en memoria para subirlo a R2
  )
  async create(
    @GetUser() user: any,
    @Body('type') type: string,
    @Body('title') title: string,
    @Body('description') description?: string,
    @Body('content') content?: string,
    @Body('provider') provider?: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    this.logger.log(
      `[create] user=${user?.id} type=${type} title=${title} hasFile=${!!file}`,
    );

    // ── Subir imagen a R2 si viene un archivo ──────────────────────────────
    let imageUrl: string | undefined = content; // fallback: si mandaron URL directo

    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
        throw new BadRequestException(`Tipo de imagen no permitido: ${file.mimetype}`);
      }
      imageUrl = await this.r2.upload(file, 'posts');
      this.logger.log(`[create] Imagen subida a R2: ${imageUrl}`);
    }

    // ── Construir payload para content-ms ─────────────────────────────────
    const payload = {
      userId: user?.id as string, // ← Solo userId (UUID de MongoDB)
      type: (type ?? 'image') as 'image' | 'audio',
      title,
      description,
      content: imageUrl,   // ← URL final de la imagen en R2
      provider,
    };

    this.logger.log(`[create] Enviando a content-ms: ${JSON.stringify(payload)}`);

    try {
      const result = await firstValueFrom(
        this.contentService.send('createPost', payload),
      );
      return result;
    } catch (err) {
      this.logger.error('Error en createPost', (err as any)?.message ?? String(err));
      throw err;
    }
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contentService
      .send('findAllPosts', paginationDto)
      .pipe(catchError(handleRpcCustomError));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService
      .send('findOnePost', id)
      .pipe(catchError(handleRpcCustomError));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostsDto: UpdatePostsDto) {
    return this.contentService
      .send('updatePost', { id, ...updatePostsDto })
      .pipe(catchError(handleRpcCustomError));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService
      .send('removePost', id)
      .pipe(catchError(handleRpcCustomError));
  }
}
