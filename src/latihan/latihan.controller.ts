import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { query } from 'express';

@Controller('latihan')
export class LatihanController {
  @Get()
  findAll(@Query() query: any) {
    return  {
        query,
    }
  }

  @Post()
  create(@Body() payload: any) {
    console.log('payload', payload);
    return {
      payload: payload,
    };
  }

  @Post('create')
  create2(
    @Body('name') name: string,
    @Body('sekolah') sekolah: string,
    @Body('age') age: number,
  ) {
    console.log('name', name);
    console.log('sekolah', sekolah);
    console.log('age', age);
    return {
      name: name,
      sekolah: sekolah,
      age: age,
    };
  }

  @Put('update/:id/:nama')
  update(
    @Body() payload: any,
    @Param('id') id: string,
    @Param('nama') nama: string,
  ) {
    return {
      id: id,
      nama: nama,
      payload: payload,
    };
  }

  @Patch()
  patch() {
    return 'latihan mengaunakan PATCH';
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return {
    //   id,
    //   metode: 'DELETE',
    id : id
    };
  }
}
