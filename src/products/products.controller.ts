import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common/pagination.dto';
import { NatsService } from 'src/config';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NatsService) private readonly client: ClientProxy) {}

  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, body);
  }

  @Get()
  findProducts(@Query() pagination: PaginationDto) {
    return this.client.send({ cmd: 'find_all_product' }, pagination);
  }

  @Get(':id')
  async findProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateProductDto,
  ) {
    return this.client.send({ cmd: 'update_product' }, { id, ...body });
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'remove_product' }, { id });
  }
}
