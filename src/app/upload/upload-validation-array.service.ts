import { Injectable, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UploadValidationArrayService {
  static imageOrPdfFileFilter(req: Request, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
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
