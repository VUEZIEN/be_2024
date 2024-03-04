import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import {
  CreateProdukArrayDto,
  DeleteArrayDto,
  UpdateProdukDto,
  findAllProduk,
} from './produk.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-update_by.decorator';
import { InjectBulkCreatedBy } from 'src/utils/decorator/inject-created_bulk_by.decorator';

@UseGuards(JwtGuard)
@Controller('produk')
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Post('create-bulk')
  async createBulk(@InjectBulkCreatedBy() payload: CreateProdukArrayDto) {
    return this.produkService.createBulk(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: findAllProduk) {
    return this.produkService.findAll(query);
  }

  @Put('update/:id')
  updateKategori(
    @Param('id') id: string,
    @InjectUpdatedBy() updateProdukDto: UpdateProdukDto,
  ) {
    return this.produkService.updateProduk(Number(id), updateProdukDto);
  }

  @Delete('delete/:id')
  deleteKategori(@Param('id') id: string) {
    return this.produkService.deleteProduk(Number(id));
  }

  @Post('/delete-bulk')
  bulkDeleteBook(@Body() payload: DeleteArrayDto) {
    return this.produkService.bulkDelete(payload);
  }

  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.produkService.getDetail(Number(id));
  }
}
