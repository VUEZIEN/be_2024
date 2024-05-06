import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard } from '../auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { CreateOrderDto, findAllOrderDto } from './order.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('tambah')
  async createOrder(@InjectCreatedBy() payload: CreateOrderDto) {
    return this.orderService.createOrder(payload);
  }

  @Get('list')
  async listOrder(@Pagination() query: findAllOrderDto) {
    return this.orderService.findAll(query);
  }

  @Get('detail/:id')
  async detailOrder(@Param('id') id: string) {
    return this.orderService.findById(+id);
  }

  @Delete('delete/:id')
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(+id);
  }
}
