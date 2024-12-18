import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  constructor(@Inject('PAYMENT_SERVICE') private readonly kafka: ClientKafka) {}

  create(paymentData: { userId: string; amount: number }) {
    console.log('Publishing payment event:', paymentData);
    this.kafka.emit('create.order', paymentData);
  }
}
