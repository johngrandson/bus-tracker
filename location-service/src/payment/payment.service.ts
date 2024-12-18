import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(@Inject('PAYMENT_SERVICE') private readonly kafka: ClientKafka) {}

  async create(paymentData: { userId: string; amount: number }) {
    console.log('Publishing payment event:', paymentData);
    await firstValueFrom(this.kafka.send('order.create', paymentData));
  }
}
