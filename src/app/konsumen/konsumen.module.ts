import { Module } from '@nestjs/common';
import { KonsumenController } from './konsumen.controller';
import { KonsumenService } from './konsumen.service';

@Module({
  controllers: [KonsumenController],
  providers: [KonsumenService]
})
export class KonsumenModule {}
