import { OrderService } from '@/order/order.service';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern('create.order')
  async handleCreateOrder(@Payload() data: { userId: string; totalAmount: number }) {
    try {
      const order = await this.orderService.create(data);

      if (!order) {
        throw new Error('Failed to create order');
      }

      return { status: 'success', orderId: order?.id };
    } catch (error) {
      return { status: 'error', message: (error as Error).message };
    }
  }
}
