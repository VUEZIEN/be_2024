import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { KonsumenService } from './konsumen.service';
import { CreateKonsumenDto, findAllKonsumenDto } from './konsumen.dto';
import { JwtGuard } from 'src/app/auth/auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';

@Controller('konsumen')
export class KonsumenController {
  constructor(private konsumenService: KonsumenService) {}
  @UseGuards(JwtGuard)
  @Post('create')
  async create(@InjectCreatedBy() payload: CreateKonsumenDto) {
    return this.konsumenService.create(payload);
  }
  @UseGuards(JwtGuard)
  @Get('list')
  async findAll(@Query() query: findAllKonsumenDto) {
    return this.konsumenService.findAll(query);
  }

  @MessagePattern('belajar-kafka')
  async simpan(@Payload() payload) {
    console.log('payload', payload);
    try {
      const dto = plainToInstance(CreateKonsumenDto, payload);
      const errors = await validate(dto);
      if (errors.length > 0) {
        console.log('Validation failed:', errors);
        return;
      }
      await this.konsumenService.create({
        ...payload,
        created_by: {
          id: 1,
        },
      });
    } catch (err) {
      console.log('err', err);
    }
  }
}
