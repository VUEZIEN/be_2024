import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/app/auth/auth.guard';
import { QueryBuilderService } from './query-builder.service';

// @UseGuards(JwtGuard)
@Controller('query-builder')
export class QueryBuilderController {
  constructor(private readonly querybuilderService: QueryBuilderService) {}
  @Get('latihan')
  async LatihanController() {
    return this.querybuilderService.latihan();
  }
}
