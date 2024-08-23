import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Inject,
  Query,
  Param,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NatsService } from 'src/config';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NatsService) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.client.send('findAllOrders', pagination).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send('findOneOrder', id).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch('/change-status/:id')
  changeOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.client
      .send('changeOrderStatus', { id, ...updateOrderDto })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
