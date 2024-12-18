import { PaymentService } from '@/payment/payment.service';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('process.payment')
  async handlePayment(
    @Payload() data: { id: string; totalAmount: number; userId: string }
  ): Promise<void> {
    this.logger.log(
      `Processing payment for order ID ${data.id} with totalAmount ${data.totalAmount}`
    );
    await this.paymentService.processPayment(data.userId, data.id, data.totalAmount);
  }
}
