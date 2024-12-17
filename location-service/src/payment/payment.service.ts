import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(@Inject('PAYMENT_SERVICE') private readonly client: ClientProxy) {}

  async create(paymentData: { userId: string; amount: number }) {
    console.log('Publishing payment event:', paymentData);
    await firstValueFrom(this.client.emit('order.create', paymentData));
  }
}
