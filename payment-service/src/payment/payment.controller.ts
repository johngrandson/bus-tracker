import { PaymentService } from '@/payment/payment.service';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('process.payment.success')
  async handlePayment(
    @Payload() data: { id: string; totalAmount: number; userId: string }
  ): Promise<void> {
    this.logger.log(
      `Processing payment for order ID ${data.id} with totalAmount ${data.totalAmount}`
    );
    await this.paymentService.processPayment(data.userId, data.id, data.totalAmount);
  }

  @EventPattern('process.payment.error')
  async handleError(@Payload() data: { userId: string; error: any }): Promise<void> {
    this.logger.error(`Error processing payment for user ID ${data.userId}: ${data.error}`);
    this.paymentService.processError(data.userId, data.error);
  }
}
