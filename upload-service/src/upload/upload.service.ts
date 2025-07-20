// upload.service.ts
import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  async handleFileUpload(file: Express.Multer.File): Promise<any> {
    // return {
    //   originalName: file.originalname,
    //   filename: file.filename,
    //   size: file.size,
    //   mimetype: file.mimetype,
    //   path: file.path,
    //   url: `/uploads/${file.filename}`,
    // };
     return {
        message: '',  
        statusCode: 200,
        data:`${process.env.UPLOAD_BASE_URL}/${file.filename}`
      }
  }
    async handleMultipleFilesUpload(files: Express.Multer.File[]): Promise<any> { 
     return {
        message: '',  
        statusCode: 200,
        data: files.map(file => `${process.env.UPLOAD_BASE_URL}/${file.filename}`)
      }
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
