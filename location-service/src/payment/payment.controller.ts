import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from '@/payment/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  createPayment(@Body() paymentData: { userId: string; amount: number }) {
    this.paymentService.create(paymentData);
    return { message: 'Payment published successfully!' };
  }
}
