import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from '@/payment/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Body() paymentData: { userId: string; amount: number }) {
    try {
      await this.paymentService.create(paymentData);
      return { message: 'Payment published successfully!' };
    } catch (error) {
      console.error('Error publishing payment event:', error);
      throw error;
    }
  }
}
