import { PrismaService } from '@/prisma/prisma.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitMQClient: ClientProxy
  ) {}

  async processPayment(userId: string, orderId: string, totalAmount: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id: orderId }
      });

      if (!existingOrder) {
        throw new Error(`Order with ID ${orderId} does not exist.`);
      }

      const payment = await tx.payment.create({
        data: {
          orderId,
          amount: totalAmount,
          currency: 'USD',
          status: 'PENDING'
        }
      });

      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'CONFIRMED' }
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: 'COMPLETED' }
      });

      this.logger.log(`Payment for order ID ${orderId} processed successfully`);

      this.rabbitMQClient.emit('ticket.deliver', {
        userId,
        orderId,
        paymentId: payment.id
      });
    });
  }
}
