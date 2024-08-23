import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
