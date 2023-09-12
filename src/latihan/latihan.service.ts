import { Injectable } from '@nestjs/common';

@Injectable()
export class LatihanService {
  testing() {
    return 'hello, world!';
  }

  name() {
    return 'Ariiq';
  }
}
