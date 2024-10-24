import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard } from '../auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { CreateOrderDto, UpdateOrderDto, findAllOrderDto } from './order.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-update_by.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Post('tambah')
  async createOrder(@InjectCreatedBy() payload: CreateOrderDto) {
    return this.orderService.createOrder(payload);
  }

  @UseGuards(JwtGuard)
  @Put('update/:id')
  async updateOrder(
    @Param('id') id: number,
    @InjectUpdatedBy() payload: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(+id, payload);
  }

  @UseGuards(JwtGuard)
  @Get('list')
  async listOrder(@Pagination() query: findAllOrderDto) {
    return this.orderService.findAll(query);
  }

  @UseGuards(JwtGuard)
  @Get('detail/:id')
  async detailOrder(@Param('id') id: string) {
    return this.orderService.findById(+id);
  }

  @UseGuards(JwtGuard)
  @Delete('delete/:id')
  async deleteOrder(@Param('id') id: number) {
    return this.orderService.deleteOrder(+id);
  }

  @UseGuards(JwtGuard)
  @Post('tambah-kafka')
  async createOrderKafka(@InjectCreatedBy() payload: CreateOrderDto) {
    return this.orderService.sendOrderToKafkaWithSend(payload);
  }

  @MessagePattern('order')
  async getPayloadFormKafka(@Payload() payload) {
    console.log('payl', payload);
    return this.orderService.createOrderFromKafka(payload);
  }
}
