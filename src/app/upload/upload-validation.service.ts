import { Injectable, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UploadValidationService {
  static UploadFilter(req: Request, file, callback) {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const fileExtension = file.originalname.split('.').pop();

    if (!allowedExtensions.includes(fileExtension)) {
      return callback(
        new BadRequestException(
          'Hanya format jpg, jpeg, png, pdf yang diperbolehkan',
        ),
        false,
      );
    }
    callback(null, true);
  }
}
