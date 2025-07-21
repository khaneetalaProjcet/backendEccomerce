// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  UploadedFiles
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {JwtAdminAuthGuard} from "../jwt/admin-jwt-auth.guard"
import { UploadService } from './upload.service';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('upload')
@ApiTags('Upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a secure file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = process.env.UPLOAD_DIR || 'uploads';
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          const safeName = `${file.fieldname}-${uniqueSuffix}${fileExt}`;
          cb(null, safeName);
        },
      }),
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '2097152', 10),
      },
      fileFilter: (req, file, cb) => {
        // const allowedTypes = (process.env.ALLOWED_TYPES || 'image/jpeg')
        //   .split(',')
        //   .map((t) => t.trim());

        // const forbiddenExts = (process.env.FORBIDDEN_EXTENSIONS || '')
        //   .split(',')
        //   .map((ext) => ext.trim());

        const ext = extname(file.originalname).toLowerCase();
        const mime = file.mimetype;

        // if (forbiddenExts.includes(ext)) {
        //   return cb(new BadRequestException('Forbidden file extension'), false);
        // }

        // if (!allowedTypes.includes(mime)) {
        //   return cb(new BadRequestException('Unsupported file type'), false);
        // }

        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: any) {
    return this.uploadService.handleFileUpload(file);
  }



  @Post('multiple')
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple files securely' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = process.env.UPLOAD_DIR || 'uploads';
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          const safeName = `${file.fieldname}-${uniqueSuffix}${fileExt}`;
          cb(null, safeName);
        },
      }),
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '20971520'),
      },
      fileFilter: (req, file, cb) => {
        // const allowedTypes = (process.env.ALLOWED_TYPES || '')
        //   .split(',')
        //   .map((t) => t.trim());

        // const forbiddenExts = (process.env.FORBIDDEN_EXTENSIONS || '')
        //   .split(',')
        //   .map((ext) => ext.trim());

        const ext = extname(file.originalname).toLowerCase();
        const mime = file.mimetype;

        // if (forbiddenExts.includes(ext)) {
        //   return cb(new BadRequestException('Forbidden file extension'), false);
        // }

        // if (!allowedTypes.includes(mime)) {
        //   return cb(new BadRequestException('Unsupported file type'), false);
        // }

        cb(null, true);
      },
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files: any) {
    return this.uploadService.handleMultipleFilesUpload(files);
  }
}
