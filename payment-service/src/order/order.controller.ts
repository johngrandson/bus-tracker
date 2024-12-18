import { OrderService } from '@/order/order.service';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern('order.create')
  async handleOrderCreate(@Payload() data: { userId: string; totalAmount: number }) {
    await this.orderService.create(data);
  }
}
