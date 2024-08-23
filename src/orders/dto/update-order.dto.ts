import { IsEnum } from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';

export class UpdateOrderDto {
  @IsEnum(OrderStatusList, {
    message: `Valid status are ${OrderStatusList}`,
  })
  status: string;
}
